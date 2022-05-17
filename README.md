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

`polling` means fetching data on a regular basiss
