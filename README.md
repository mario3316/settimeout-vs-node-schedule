# settimeout() vs node-schedule 메모리 사용량 비교

- 정확한 Memory Usage 비교 방법은 아니지만 어느정도 메모리 사용량이 차이나는지 확인하기 위해 진행
- settimeout() 과 node-schedule의 scheduleJob() 을 사용하여 각각 100000개의 Job을 생성
- Memory Usage를 확인하기 위해 node-heapdump 사용

- settimeout()

  - 최대 메모리 사용량 약 80.2Mb
    ![settimeout](https://user-images.githubusercontent.com/51048267/120077291-b5cb2d00-c0e4-11eb-95ca-c0e4e55c240c.png)

- node-schedule scheduleJob()

  - 최대 메모리 사용량 약 291.6Mb
    ![node-schedule](https://user-images.githubusercontent.com/51048267/120077303-cbd8ed80-c0e4-11eb-9473-ae7f0d10d14a.png)

- 결론
  - node-schedule은 cron 기반이여서 메모리를 더 적게 사용할줄 알았는데 실제로는 settimeout이 훨씬 사용량이 적었다.
  - settimeout() 호출이 많아질 때 Call Back이 실행되는 시간이 부정확해지는 현상에 대한 원인을 다시 찾아야겠다..
