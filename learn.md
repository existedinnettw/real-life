這裡放一些開發過程順便的學習。



[Git教學：如何 Push 上傳到 GitHub？](https://gitbook.tw/chapters/github/push-to-github.html)

上傳repository到github





---

# google calendar api

[google calendar api Browser Quickstart](https://developers.google.com/calendar/quickstart/js)

按著做基本就ok，重點是看一下return 的 event object的 結構

![image-20200410012013769](C:\Users\insleker\Google Drive\projects\real-life\learn.assets\image-20200410012013769.png)

Cloud Platform project 應該算是一個app 對外串接google api 的界面。

[create event - Add event metadata](https://developers.google.com/calendar/create-events#metadata)

一個user 可以用多個calendar，except user 本身的(id:'primary')

[CalendarList: list](https://developers.google.com/calendar/v3/reference/calendarList/list)

> 這個document寫的不是很全，沒有browser(JS)的詳細example

browser, list 所有 calendar

```javascript
        function listCalendarList() {
            gapi.client.request({
                'path': '/calendar/v3/users/me/calendarList',
                'method': 'GET',
            }).then(function(response){
                let obj= JSON.parse(response.body)
                console.log(obj)
            });
        }
```

![image-20200410011925831](C:\Users\insleker\Google Drive\projects\real-life\learn.assets\image-20200410011925831.png)

[google-api-javascript-client](https://github.com/google/google-api-javascript-client)

github ，基本的api 使用





[Calendars: insert](https://developers.google.com/calendar/v3/reference/calendars/insert)

這個api 應該可以新增calendar



[react-google-calendar-api](https://github.com/Kubessandra/react-google-calendar-api)

這個react api 可以看一下，裡面蠻簡單的

## summary

簡單來說，我要做的事是 create calendar --> store calendar id --> add event to specific calendar。以上這些步驟都確定可以完成。再來的問題是要不要基於 該react lib

如果要用，我應該fork它，並且怎麼樣才是好的，在project裡使用方式還要了解下。