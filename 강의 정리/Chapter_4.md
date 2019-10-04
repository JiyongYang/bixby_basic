# 04강. Business Logic 구현

------

## 1. Javascript 기초와 Bixby Business Logic 구현

### 1)  Javascript 기초

```javascript
const PhoneData = require("./data/PhoneData.js");

module.exports.function = function showPhoneList (modelName) {
    let result = [];
    
    if(modelName != underfined){
        for(var i=0; i < PhoneData.length; i++){
            if(PhoneData[i].name == modelName){
                result.push(PhoneData[i])
            }
        }
    else{
        result=PhoneData;
    }
    }
    return result
}
```

- Module.exports: 다른 파일에서 해당 함수 혹은 값이 사용될 수 있도록 모듈화하는 함수.

- Require: Module.exports의 저장 값을 가져오는 함수.

- 변수: 데이터를 저장하는 장소

  ```javascript
  var: 전체 외부함수까지 사용할 수 있는 유효 범위.
  const: 블록 유효 범위를 갖는 변수. let과 다른 점은 한번 할당된 값은 변경 불가.
  let: 블록 유효 범위를 갖는 변수. 할당된 값을 변경할 수 있다.
  ```

- 분기: If문

- 루프: for문

---

### 2) Bixby Business Logic

### 1) Action과 Javascript

```javascript
// bixby action

action (Operation) {
    type(Calculation)
    collect {
        input (leftOperand) {
            type (LeftOperand)
            min (Required) max (One)
        }
        input (rightOperand) {
            type (RightOperand)
            min (Required) max (One)
        }
        input (operator) {
            type (Operator)
            min (Required) max (One)
        }
    }
    
    output (Result) {
        throws {
            unknown-error {
                on-catch {
                    halt {
                        dialog {
                            template ("문제가 생겼네요. 다시 한번 말씀해주세요.")
                        }
                    }
                }
            }
        }
    }
}
```

```javascript
// javascript

module.exports.function = function Operation(leftOperand, rightOperand, operator) {
    var result = 0;
    var name = '';
    
    operator = String(operator);
    
    if(operator == "plus"){
        name = "더하기";
        result = leftOperand + rightOperand;
    }else if(operator == "subtract"){
        name = "빼기";
        result = leftOperand - rightOperand;
    }else if(operator == "multiplication"){
        name = "곱하기";
        result = leftOperand * rightOperand;
    }else if(operator == "division"){
        name = "나누기";
        result = leftOperand / rightOperand;
    }
    
    return {
        operator: name;
        result: result;
    }
}
```

- Action과 Javascript 파일은 1:1 매칭.

- Action의 input은 Javascript 함수의 parameter.

- Action의 output은 Javascript 함수의 return 값.

- Endpoints: Action과 리소스를 매핑시켜주는 설정.

  ```javascript
  - Local: Action과 로컬 리소스를 매핑.
  - Remote: Action과 외부 리소스를 매핑.
  ```

  ```javascript
  endpoints {
      // action과 그에 맞는 js를 매핑한다.
      action-endpoints {
          action-endpoint (Operation) {
              accepted-inputs (leftOperand, rightOperand, operator)
              local-endpoint (Operation.js)
          }
      }
  }
  ```

<br/>

### 2) Bixby에서 사용 가능한 내장 API

- Config: Capsule의 configuration 정보를 가져온다.

  ```javascript
  // Bixby 파일 내에 configuration 정보를 모아 두는 Capsule.properties에서 데이터를 가져올 때 사용한다.
  
  var waitingDeliverTermInt = config.get("waitingDeliverTerm") * 1;
  var deliverTermInt = config.get("deliverTerm") * 1;
  ```

- Console: Debug Console에 로그를 찍을 때 사용.

  ```javascript
  let result = null;
  
  for(let i = 0; i < fakeData.length; i++ ){
      if(fakeData[i].location == String(location)){
          result = fakeData[i];
          break;
      }
  }
  
  console.log(result);
  
  return result;
  ```

- Dates: 날짜 관련 함수를 제공.

  ```javascript
  var deliverStartTime = dates.ZonedDatetime.fromDate(currentTime.getDateTime()).plusMinutes(waitingDeliverTermInt).getDateTime();
  var deliverEndTime = dates.ZonedDateTime.fromDate(currentTime.getDateTime()).plusMinutes(deliverTermInt).getDateTime();
  ```

- Fail: Runtime 에러 exception을 핸들링.

  ```javascript
  module.exports.function = function getResultHalt () {
      throw fail.checkedError('이 에러는 정지를 일으킵니다.', 'ErrorWhichHalts' {});
      return 'Not implemented';
  }
  ```

  ```javascript
  output (Result) {
      throws {
          error (ErrorWhichHalts) {
              on-catch {
                  halt {
                      dialog {
                          template ("에러로 인하여 실행을 정지합니다.")
                      }
                  }
              }
          }
      }
  }
  ```

- http: http request를 위한 함수를 제공.

  ```javascript
  response = http.oauthGetUrl(url, {format:"json", cacheTime:0, returnHeaders:true});
  console.log(response);
  if(response.status == 404 || response.status == 500 || response.status == 502 || response.status == 504){
      throw fail.checkedError("Server Error", "ServerProblem");
  }
  ```

- Secret: Capsule의 secrets를 가져온다.

