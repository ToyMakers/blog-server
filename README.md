# Blog API 프로젝트

이 프로젝트는 NestJS와 MongoDB를 사용하여 블로그 API를 구축합니다. JWT를 이용한 인증 및 권한 관리를 포함하고 있습니다.

## 프로젝트 구성

- NestJS
- MongoDB
- Docker
- Swagger

## 설치 및 실행 방법

### 1. Docker 설치

프로젝트를 시작하기 전에 Docker가 설치되어 있는지 확인합니다. Docker가 설치되지 않은 경우 아래 링크를 참고하여 Docker를 설치합니다.

- [Docker 설치 가이드](https://docs.docker.com/get-docker/)

### 2. Docker를 사용하여 MongoDB 실행

프로젝트 루트 디렉토리에 docker-compose.yml 파일이 있습니다. Docker Compose를 사용하여 MongoDB를 실행합니다.

```bash
npm run database:start
```

### 3. 프로젝트 의존성 설치

npm을 사용하여 프로젝트 의존성을 설치합니다.

```bash
npm install
```

### 4. 프로젝트 실행

```bash
npm run start
```

### 5. Swagger 확인

```url
http://localhost:8000/api
```
