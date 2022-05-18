# React Query Practice

프로젝트에 적용해 보기 전에 React Query 컨셉 및 기본 코드를 이해하기 위한 리포지토리

## Traditional(Axios + React native hooks) vs React Query(Axios + react query hooks)

#### Traditional

- isLoading, data, error 등을 담고, 활용하기 위해 useState hook(or redux 등 상태관리 라이브러리) 활용

- useEffect hook으로 필요할 때 data fetching 실행

- error 핸들링의 경우, catch 블록을 통해서 error 관련 로직 실행

#### React Query

- isLoading, data 는 굳이 useState를 이용해서 관리할 필요가 없음 `useQuery hook`을 통해서 `isLoading`, `data` 라는 정해진 이름의 변수를 활요할 수 있다.

- `useQuery` 메서드가 선언되어 있으면 자동으로 data-fetching 이 이루어지는 것으로 보인다(instead of useEffect)

- error 핸들링의 경우, `isError`, `error` 두 가지 키워드를 제공, `isError`는 에러 여부를 담고 있는 boolean 값이고, error는 error 객체이다. 즉 error 메세지를 어딘가에 표시하고 싶으면 `error.message`를 활용

- 일부러 error 가 나도록 해서 테스트를 해보면 실제 에러 메시지가 뜰 때까지 기존 방법에 대해서 시간이 더 오래 걸리는 것을 확인할 수 있다. 이는 react query 가 요청에 대한 응답으로 에러가 반환될 때, 3번의 재요청을 하도록 설정되어 있기 때문이다.

---

## DevTools

React Query의 동작과 관련된 상태를 확인할 수 있는 DevTool 이 제공된다.

root에 `QueryClientProvider client={queryClient}` 와 같이 제공했던 것처럼, root에 DevTools 도 제공해주면 됨

감싸주는 방식이 아니라 그냥 하나의 컴포넌트를 더 렌더링 한다고 생각하면 된다.

```javascript
<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
```

---

## QUERY CACHE

React Query를 통해서 불러온 데이터를 담고 있는 페이지의 경우, 요청 관련 로직의 변화가 없으면 Loading 문구가 뜨지 않는다. 왜일까?

By default, every query is cached for 5 minutes and react query relies on that cache

이렇게 동작하는 원리를 알아보자.

최초로 특정 key 를 가지는 useQuery가 실행되었을 때, useQuery는 다음의 동작들을 수행한다

- isLoading을 true로 설정
- send request
- request가 잘 완료되면 key 와 fetch function을 unique 한 식별자로 하여서 data cache(`by default 5 minutes`)

다시 data-fetching 로직이 실행되면 우선 해당 data 가 cache 에 존재하는지 확인
-> 존재하면, 해당 data를 return 하는 방식을 통해서 loading시간을 줄이고, api call에 대한 성능최적화가 된다.

하지만, react query는 이 데이터가 client 단이 아니라 server 단에서 변경될 가능성이 있다는 것을 알고 있다.
그래서 useQuery 메서드가 실행되면 cache가 있어도 background refetch가 trigger 된다. 그리고 fetch 한 데이터가 다른 경우 UI가 이 데이터를 반영해서 업데이트 된다.

근데 background refetch 가 진행될 때는 isLoading state 가 변하지 않나?
이에 대해서는 isFetching 이라는 state가 존재한다. refetch 작업의 경우 isLoading은 false 이지만, isFetching은 true -> false로 변경되는 것을 확인할 수 있음

default 5minutes 를 바꾸고 싶으면 useQuery 메서드에 세 번짜 인수 전달하면 된다.

이 세 번째 인수는 useQuery 에 대한 config 객체라고 보면 됨. cacheTime 필드에서 시간을 설정해주면 된다.

## State Time

> data가 fresh -> stale 상태로 변경되는데 걸리는 시간

background data fetching이 이루어지는 대상 data가 자주 업데이트 되지 않는 데이터라는 것을 알고 있는 상황을 가정해보자.

이 경우에는 refetch 가 매번 이루어지는 것은 자원의 낭비라고 볼 수 있다.

이 때 설정해줄 수 있는 config field 가 `staleTime`이다.(by default 0 seconds)

`staleTime` 필드를 n 초로 설정했다고 가정해보자. 그러면 이 n 초 동안은 useQuery hook이 다시 실행되어도, cache 된 데이터가 있는 경우에는 background fetching이 실행되지 않는다.

n초 동안은 `isFetching` 이 `false` 값을 유지하는 것을 확인할 수 있다. 또한 네트워크 탭을 확인해보면, staleTime 이 없는 경우에는 background fetch 작업으로 인한 네트워크 통신이 이루어지는 것이 보이지만, staleTime 을 세팅할 경우에는 이 네트워크 통신 자체가 없는 것을 확인할 수 있다.

즉 staleTime 과 cache 를 통해서 api 호출관련 자원 소모 최적화를 도모할 수 있다.

## other refetch 관련 설정 fields

#### refetchOnMount

`default: true`

`data refetching`이 data가 stale 일 경우 컴포넌트가 mount 될 때마다 이루어진다. 이는 기존 useEffect([] as dependency)를 활용한 data-fetching 작업과 비슷한 형태이다.

stale? `신선하지 않은`이라는 사전적 정의를 가지고 있다.

`false` 로 지정하면 mount 시에 refetching 이 동작하지 않음

string `'always'`로 지정하면 stale/fresh 여부와 상관없이 component 가 mount 할때마다 refetch 실행(자주 변경되는 경우에 적절할듯?)

#### refetchOnWindowFocus

`default: true`

탭이 focus를 잃었다가, 다시 focus 될 때마다 refetch를 실행한다.

stale/fresh 여부와 `always` 값을 받아 동작하는 방식은 refetchOnMount 와 동일하다

## polling?

`polling` means fetching data on a regular basis

#### refetchInterval

by default: false

milliseconds 단위로 설정해줄 수 있다.

그리고 설정된 시간 간격으로 데이터를 해당 쿼리로 받아오게 된다.

거래소와 같이 초단위로 많은 데이터의 변경이 이루어지는 경우 등에서 이런 기능이 필요할 것이다.

2초로 설정하면 2초 마다 fetching 이 true가 되는 것을 확인할 수 있다.

react query에서 polling 은 해당 탭 window가 focus를 잃으면 일시 정지 된다...라고 하는데 왜 나의 경우에는 focus가 없는 상태에도 정보가 계속 refetch 되고 있지
-> refetchIntervalInBackground 의 경우, 해당 컴포넌트가 일단 mount되어 있는 상태에서 동작한다. 또한 해당 창이 윈도우 화면에서 유저에게 보여지고 있는 상태인 경우에는 focus가 있다고 간주된다. 만약에 다른 탭으로 이동해서 해당 탭이 보이지 않는 경우에는 refetchIntervalInBackground이 true인 경우에만 데이터 refetching 이 이루어짐

## useQuery on Click

지금까지는 컴포넌트가 mount 되거나 window에 focus 가 잡힐 때 마다 자동으로 get query(request)가 전송되었다.

하지만 컴포넌트가 마운트 될 때가 아니라, 유저의 특정 입력에 따라서 데이터를 불러와야 하는 경우도 굉장히 많다.

버튼을 클릭했을 때, fetching이 이루어지도록 해보자

이를 위해서는 두 단계가 필요하다..

- useQuery에게 'mount되어도 request fire하지마'라고 알려줘야함({enabled: false}라는 설정을 전달해서 해결)
  -> 이렇게 하면 페이지에 진입(component 가 mounted)해도 api call(query)가 실행되지 않음
- 버튼 클릭시 불러오는 로직 작성
  -> useQuery 훅이 반환하는 data, isError 등 값들 중에는 `refetch`라는 함수도 있다. 클릭시에 이 함수가 실행되도록 해주면 됨

`refetch` 함수를 통해서 특정 조건 충족시에 데이터를 fetch하는 경우에는, isLoading은 false 이지만 isFetching 이 true 로 설정되는 경우에 해당된다. 즉 로딩 화면을 보여주려면 isFetching 값을 활용하는 것을 고려해야 한다.

## Success and Error Callbacks

Query 결과에 따라서 side effect를 실행하고 싶은 경우가 있다. 예를 들어, 모달을 Open 한다던지, 다른 source 로 네비게이션 한다던지, toast notification을 한다던지 하는....

이런 성공/실패에 따른 sideEffect를 실행하기 위해서는 config 객체에 onSuccess/onError field에 해당 경우에 따라 실행하고 싶은 함수를 전달하면 된다.

여기서 react query 가 또 신경쓴 좋은 부분 중 하나는..

**Success 일 경우 data를, Error인 경우에는 error를 해당 콜백함수에 전달해준다는 것**

인자로 전달된 data, error등을 활용해서 side effect를 실행할 수있다는 건 매우 강력한 기능이다.. 진짜로... 이거 rq 없이 하려면 도대체 얼마나 또 코드를 복잡하게 짜야할지 감도 안오네 ㄷㄷ

## Data Transformation

select 필드를 활용해서 넘겨 받는 데이터를 원하는 대로 가공해서 data 변수로 넘겨받는 형태로 작업할 수 있다.

select 필드에 전달된 콜백 함수에 data 를 인수로 전달하고, 이 인수를 안에서 처리해서 원하는 데이터 형태를 return 하면 return 된 데이터가 data 변수에 새롭게 담아진다.

## Custom Query Hook

fetch(get) data 하기 위해서 사용되는 것이 useQuery 훅.

useQuery 훅은 세 가지 인수를 받음

- unique key
- fetch 함수
- useQuery 훅의 동작을 관리하는 config 객체

그런데, 특정 useQuery 훅을 재사용하려면 어떻게 해야할까? 물론 코드를 복사해서 다시 작성할 수있겠지만, 이것은 best practice라고 보기 어렵다.

custom query hook 로직을 별도의 파일로 분리해서 모듈화해서 가져다 쓰는 방식을 활용하자.

## Query by id

react query는 자동으로 heroId를 fetch 함수에 넣어준다.

근데 자동으로 넣어주는 것이 뭐임? 무슨 값을 넣어도 일단 전달해준다는 소리임?

그건 바로...

```javascript
const fetchHeroById = (heroId) => {
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const useSuperHeroData = (heroId) => {
  return useQuery(["super-hero", heroId], () => {
    return fetchHeroById(heroId);
  });
};
```

원리 heroId값을 전달해주고, 이를 다시 fetch함수에 전달해서 해당 값을 return 받는 식으로 코드를 짰다. 하지만, react query는 useQuery 함수 실행 시 두 번째로 전달받은 fetch에 default 로 여러 값을 전달하도록 되어 있다.

그 중에서, `queryKey` 라는 값은 useQuery 함수에 첫 번째로 전달한 유니크한 키 값 혹은 키 값 배열을 담고 있다. 즉, 위 코드의 경우...

```javascript
const fetchHeroById = ({ queryKey }) => {
  const heroId = queryKey[1];
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const useSuperHeroData = (heroId) => {
  return useQuery(["super-hero", heroId], fetchHeroById);
};
```

이렇게 짤 수 있다는 뜻이 된다.

즉 id값으로 useQuery를 통한 data fetching 작업을 하기 위해서는...

id 값을 useQuery 혹은 useQuery를 활용하는 custom hook 에 전달한다.

해당 id 값을 useQuery 함수의 첫 번째 인자로 전달해준다.

첫 번째 인자로 전달된 값은 두 번째 인자인 fetch 콜백함수에 자동으로 전달된다. 이를 활용하려면 전달되는 많은 값들 중에서 `queryKey`라는 값을 활용하면 된다. 이는 배열이므로, 배열의 몇 번째 인지 정해주면 되는 것

## Parallel Queries

때로는 하나의 컴포넌트에서 여러 개의 API 로부터 데이터를 불러오는 경우가 있다.

어떻게 해야될까? 뭔가 신박하게 막 두개를 묶어서 해결해주는 기능이 있을까?

우리는 종종 이런 라이브러리를 활용할 때, 지나치게 복잡하게 생각하는 경우가 많다.

코드 짤때 너무 복잡하게 생각하지 말자.

서로 다른 두 개의 API 로부터 데이터를 불러온다 치면, 각각의 경우에 대해서 useQuery를 한 번 씩, 총 두 번 써주면 되는 것이다. as simple as that.

근데 그러면 data, isLoading 같은 변수이름 겹치지 않나?
-> alias 를 활용해서 선언하면 되지롱 아래처럼 말이야

```javascript
const {
  data: superHeroes,
  isLoading: loadingHeroes,
  error: heroesLoadingError,
} = useQuery("superheroes", fetchSuperHeroes);
```

## Dynamic Parallel Queries

몇 가지 종류의 서로 다른 요청이 필요할지 사전에 안다면 위에서 처럼 정해진 횟수의 useQuery 훅을 실행해주면 된다.

하지만, 그 종류의 개수가 dynamic 한 경우에는 어떻게 해야할까??

이 때 사용할 수 있는 훅이 `useQueries` 훅이다

```javascript
const queryResults = useQueries(
  heroIds.map((id) => {
    return {
      queryKey: ["superhero", id],
      queryFn: () => fetchSuperHero(id),
    };
  })
);
```

그러면 저 queryResults에는 무엇이 들어있는가?
== useQueries 훅이 반환하는 값이 무엇인가?

전달된 값의 개수만큼의 useQuery hook의 배열

즉 아래 같은 형태로 값에 접근할 수 있게 된다

```javascript
const { data, isLoading } = queryResults[0];
```

parallel query는 병렬적인 호출을 통해서 concurrency를 최대한 유지하는 것이 목표일 때 사용하는 방법이다.

하지만, 어떨 때는 query 1이 실행된 다음에 query2를 실행하고 싶은 경우도 있다.

## Dependent Queries

특정 쿼리가 다른 쿼리에 기반해서 이루어져야 할때는 어떻게 해야할까?

이것 또한, 뭐 대단한 로직으로 실행하는 것이 아니라 말 그대로 선행조건을 충족시켰을 때 다음 로직이 실행되도록 해주면 된다.

첫 번째 쿼리가 실행되고, 성공적으로 처리 되었을 때 그 reponse 에서 다음 쿼리에 필요한 데이터를 받아서 담고 있을 변수가 있다고 생각해보자.

그러면 해당 변수는 원래는 undefined(nullish)한 값이겠지만, 첫 번째 쿼리가 잘 실행될 경우 특정 데이터가 담긴다(truthy)

두 번째 쿼리의 enabled 속성을 활용해서, 이 첫 번째 쿼리의 결과값으로 인해 해당 변수에 값이 truthy 일때
true 가 되도록 하면, 첫 번째 쿼리값이 받아져야만 enabled 가 true 가 되어서 두 번째 쿼리가 실행된다.

여기서 `!!(double negation)` 개념 알고 가자.


