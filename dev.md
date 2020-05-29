# real moment



[TOC]

> 不要一次做到100分

# 基本資料

名字改叫 real moment, 活在當下。並且把宅宅外的一般user 也納入。如果只考慮宅宅了話，其它的人是“完全"不會關注的。

## lincense

MIT。這個軟體主要也算是跟別人交朋友，學會用github? private了話，別人直接idea copy 其實很簡單。



# 大致外型

精準用腦 ch2 白板工作術

白板model

剩餘x 分鐘

“完成”...事

feedback: 達成率

工作90分鐘，睡覺建議。

---

當日工作安排，超時提醒，休閒不足or 超時提醒

運動時間是工作還是休閒？

side project是工作還是休閒？

零碎雜事怎麼算?

原本是時間、重要度、事項

我認為分成 必須：包含運動、功課之類，有強制性的活動。休閒：code boost, read book。 純休閒：comic, gaming

* memo (未能安排事項)
  * 懶得執行
  * 能力不夠無法執行
  * 遙遠的願望

# refine

## 架構草稿

* 今日事
  * = schedule(手選)+ periodic(自動)



* schedule
  * 一個月內
  * datatype: 
    * name
    
    * due time
    
    * type
    
    * expect time(hr)(float)
    
      * > 小時?分鐘？小時應該比較好，重點是那些花時間的項目，倒垃圾之類的適合用 min但不重要
    
    * time spent



* periodic work

> 願望類的先不放進來，目前先只考慮“已經”納入規劃的

## analyze

data 肯定會有不夠好的地方，自己處理。e.g. 花費時間=0

# implement

我希望很多時候是單頁的，一個頁面在不同的功能切換，這是react的專長。但還是用pop new windows的需求。但我又不是很想馬上引入react，因為瞬間複雜很多(search: electron react)

[Building an Electron application with create-react-app](https://www.freecodecamp.org/news/building-an-electron-application-with-create-react-app-97945861647c/)

[electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate): github ，這個真的省事很多。但是要用typescript，而且裡面結構複雜看不懂。

[Create Your First React Desktop Application in Electron with Hot-Reload ](https://dev.to/jsmanifest/create-your-first-react-desktop-application-in-electron-with-hot-reload-4jj5)

已經成功的設置，是蠻不錯的教學。



[ 工具開發閒聊：從AutoIT到Electron / DIY Tools: From AutoIT to Electron ](http://blog.pulipuli.info/2019/09/autoitelectron-diy-tools-from-autoit-to.html)

這個人是直接用vue



# database

我的目標目前改成讓手機端的用戶也能使用，但那是最終目標。

## google api

老師在上課的時候用提到google api，但google api 有一點問題，它的資料格式和我想實現的不一樣 e.g. expect time, used time，所以就算用了他，我還是必須使用自制的資料庫去擴充不足的欄目。

這讓人不禁覺得，其實沒必要用，直接用資料庫去做就好。為了用戶方便，比如想要同步在google calendar上顯示，後期再進行處理應該就好

## 網路端

如果使用了資料庫，或是api之類透過網路的東西，本質上就是限制了使用場景，並不一定每個人都能用到網路。或是說當你用它時發現沒網路==> 超煩

但是依賴local 技術在不同的平臺可能要寫(or 改)好幾份code，這也很容易產生bug，而且容易因為硬體不同（e.g. 太舊?）

### 多用戶端同步問題

多用戶端e.g. 同時pc, phone 表示使用app時，網路是必要的。當然也是可以先存local再同步，但那就更麻煩，而且容易出錯。

用戶端同步了話，除了用到網路，local storage也是同時用到的，所以是一種最容易出bug的形式。



綜合以上，我會建議先自己搭sql server 比較好。



# 案例

我的這類大型程式的架構太不熟，但是語法什麼的都還又會，所以直接看案例。

## 30 天賭場

[三十天路邊賭場上線了！](https://ithelp.ithome.com.tw/users/20109783/ironman/2287?page=3)

他只用express 這個最基本的框架e.g. route。

### user info

user data 之類的是存在lowdb這個database裡，和遠端的gaming server在一起。

login 是用 jwt認證，`user_api.js` 有 `jwt.sign` function。然後會return token。有token 後就可以在game server 裡隨意做事by socket in `gameServer/controllers/WsController.js`



### login 後該user 的data

gameServer/lib/$R.js 可以看到 `var betInfo = function (id) {...` 它是用 `dbBet` 這個database，且用 user_id 去查。也就是所有人的賭金資料放一起，只是用id 去查。我的case了會就會是所有人的calendar 放一起，只是用id 去查

[Explain 做 SQL SELECT 語法效能測試](http://kejyun.github.io/high-scaling-websites-structure-learning-notes/Database/Database-MySQL-SELECT-SQL-Explain-Test.html)

這是一個經典的case，一樣是 id 和 留言一張表，內含所有留言

## by redux

[react项目实现登录注册](https://www.jianshu.com/p/a735096f3eda)

> key word: react 使用者登入

[用 React + Redux + Node（Isomorphic JavaScript）開發食譜分享網站](https://www.bookstack.cn/read/reactjs101-zh-tw/Ch10-react-router-redux-node-isomorphic-javascript-open-cook.md)

>  看登入的部份
>
> 這本書應該很不錯。

注意，或許可以搭配google 帳號登入，我覺得會簡單很多。e.g. 不用做 new account page、不用怕user new account 覺得麻煩。

### google

[adding google sign-in to your webapp — a react example](https://codeburst.io/adding-google-sign-in-to-your-webapp-a-react-example-dcec8c73cb9f)

[react-google-login](https://github.com/anthonyjgrove/react-google-login)

[React Google login with example](https://w3path.com/react-google-login-with-example/)

## context, hook

[[译]React中的用户认证(登录态管理)](https://zhuanlan.zhihu.com/p/67055572)



# log

3/2

決定還是直接用js手刻做single page app，react 的設計我是認同的，透過object直接操作dom，但是額外再學react開銷太大，特別是jsx。vue的學習會簡單一點，是透過模板，而不用學jsx，但是額外學還是costy，而且我是認同jsx的只是能力不足。finally，所以先直接手刻，反正program不大。

3/24

成功設定環境，上課有教webpack之類的，所以大方面還算熟了。我認為還是react + electron 比較好

4/3

完成大部份的"皮"。

4/13

過去一週非常黑暗，自己都怕