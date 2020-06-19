# real moment



[TOC]

> 不要一次做到100分

# 基本概念

名字改叫 real moment, 活在當下。並且把宅宅外的一般user 也納入。如果只考慮宅宅了話，其它的人是“完全"不會關注的。





## lincense

MIT。這個軟體主要也算是跟別人交朋友，學會用github? private了話，別人直接idea copy 其實很簡單。



# style

UI加強，我認為講明就是對設計的好看不夠滿意。

我的題目是 real life。我認為真正的世界是什麼樣子，應該是我很重要的設計主題。我覺得真正的世界是邏輯的、單純的、安靜的、暗暗動態的

底調用 紫、白、黑組成。component 是 fade in的，browser 是視窗。partially 的瀏覽這個世界。融貫論的世界可能像球或是蜘蛛網，工作時是在表層經驗世界，越往內是內層球，邏輯上的決定，或是宏觀的經驗統計。

[ 背景圖/免費圖庫大全 – 19個精選免費圖庫網站 ](https://www.proguidescreen.com/?p=8906)

[Purple RGBA Color Model ](http://www.flatuicolorpicker.com/purple-rgba-color-model/)

顏色上要注意我沒有必要非專注在純紫色，偏紅、偏藍都可以，甚至是單純把opacity 降低。

## animation

[5 Ways to animate a React app.](https://medium.com/@dmitrynozhenko/5-ways-to-animate-a-reactjs-app-in-2019-56eb9af6e3bf)



* ReactTransitionGroup
  * 最原生
* react-animation
  * 看起來很多種類
* framer-motion
  * demo 看起來不錯，api 看起來簡單
  * 目前使用中
* ant-motion
  * maybe good with antd

### framer motion

* 有scroll





# 規劃

## 大致component

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



# DB

我的目標目前改成讓手機端的用戶也能使用，但那是最終目標。

## google api

老師在上課的時候用提到google calender api，但google api 有一點問題，它的資料格式和我想實現business logic 有一些不一樣 e.g. expect time, used time，所以就算用了他，我還是必須使用自制的資料庫去擴充不足的欄目。

這讓人不禁覺得，其實沒必要用，直接用資料庫去做就好。為了用戶方便，比如想要同步在google calendar上顯示，後期再進行處理應該就好

## 網路端

如果使用了資料庫，或是api之類透過網路的東西，本質上就是限制了使用場景，並不一定每個人都能用到網路。或是說當你用它時發現沒網路==> 超煩

但是依賴local 技術在不同的平臺可能要寫(or 改)好幾份code，這也很容易產生bug，而且容易因為硬體不同（e.g. 太舊?）

### 多用戶端同步問題

多用戶端e.g. 同時pc, phone 表示使用app時，網路是必要的。當然也是可以先存local再同步，但那就更麻煩，而且容易出錯。

用戶端同步了話，除了用到網路，local storage也是同時用到的，所以是一種最容易出bug的形式。



綜合以上，我會建議還是都在網路上比較好。為了一開始能力不夠，或是focus 基礎，我會建議先自己搭sql server 比較好。

## shema

### definition of events

想像是cpu，一件事會有initTime, dueTime, target。如果更廣義一點，再加上purpose，使得event 的目的性確保。

e.g. 要考多益。多益考試event 是那短短的3hr，initTime: 9AM, dueTime: 12PM, target: 考完+考>760?。但是還有一個event是準備多益，initTime: 從決定考試的當下，dueTime:開始考多益，target: 模擬題寫得完+9成對。



另一個問題是，所以work type 到底?

為了誰 e.g. boss, myself。之所以要做work type或許是為了知道那個重要，但這其實none sense 因為事實上每件事沒有什麼重不重要，只是要做而已，按照due 排序而已，沒有分工作類的理由



### events

粗體是create 時就要填的

其它可能是會自動產生，or 之後再update

all the time in unix timestamp

1. id
   1. auto create
2. **summary**(event name)
3. **init_time**
   1. default is Now
4. **due_time**
5. done_ts (done time stamp)
   1. if null--> not yet done
   2. if ==-1 --> fail, abandom
   3. else --> time stamp
6. **target**
   1. string
7. **purpose**
8. **expect_time**
   1. in hr(float point) ( 15min/time block )
9. time_spent
   1. in hr(float point)
10. is_today_event
    1. boolean true or false(default)
11. cycle_events_id
       1. forien key, use this property if event is generate by cycleEvents, can be null
12. **users_id**
    1. forien key, not null
    2. assign by server during create api, rather than form

#### hierarchy

我們可以把一個很大的events e.g. 唸一本書，分拆成多個小的events e.g. 唸一個章節。是否要有這個特性？

這其實牽涉到比如UI，如果有hierarchy，是不是就要把sub event 自動的排在parent event 底下？

結論是預先保留，因為確實是event 的天生結構特性之一。但是現在要implement 相關的code 太難，要大改UI

1. p_event_id

### cycle_events

template of events

1. id
2. **init_corn**
   1. use corn-parser to know when to parse
   2. corn 的符號非固定 ("/2" "2,4" )，所以還是用char 而非int array好了
   3. 統計了話應該不會用到這個table，用真正產生的event就好
3. **due_corn**
4. **summary**
5. **target**
6. **expect_time**
7. purpose
8. **users_id**
   1. forien key

cycleEvents產生event的方法是，當有event 的doneTS 被update，如果event 是有cycleID 的，表示是 cycleEvents 所產生的，所以就用cycleID找到該 template，自動新產生一個job （自動補滿最近的7個 job）。

### users

只有這兩個component，不過還是建DB 好了，interger id 方便searching

1. id
2. email
   1. 事實上我是把email當成唯一的id 

應該可以存其它user 設定 e.g. 語言、睡眠時間

接下來的問題是today_events，到底放那裡？我直覺是在user 的column額外多一欄放array of  event id，因為也多少。但後來想到，這和user friend 一樣，都是一對多。user friend 是額外拆一個表，所以這裡也拆一個

### today_events

這個項目到底應不應該和events 合併，只是多一個boolean column。

根據**entity classes**  的原則，確實應該要合併

1. id
2. users_id
   1. forien_key
3. events_id
   1. forien_key

## reference

[為什麼許多人都改用 Notion 做為主力筆記軟體？看完這個你就明白了 👍](https://www.youtube.com/watch?v=Q_PfYlAtvHc)

一開始我覺得只是markdown，但是資料庫那裡真的超強。特別是把未完成變成完成。

這個軟體的存在要問了一個問題，為何real-life 要存在，已經有那麼general的公具了，我可以create 一個table，sort by due time。完成了話就放到不同的block裡?

我認為重要在於它沒有**時間**的概念or 向度，你在做事沒有計時，應該做什麼沒有明確的顯示。也就是說，它的DB，一個event 的model它已經很完整。但它做為view, 還有control (e.g. timing)的邏輯action 不存在。這兩個點一定要做出來，否則real-life 毫無意義。



我覺得可以考慮用file e.g.json or csv 存在google drive，而不是把所有人的events 統一存在一個DB裡。這樣首先是我不再需要pay for DB, DB traffic loading，再來是改動容易，我想要改什麼直接在js 裡改就好，不需要把整個SQL server 裡的schema 改掉。

或者用google sheet 也可以，可以想見google sheet的改動或access 很容易，而且table 和DB基本是完全一樣的

可能壞處

1. access可能慢一點
2. 如果要分析所有人的資料也不能直接從DB裡拿完。但這其實很容易，user 登入時，copy 一些資料到DB就好。



# UI

## 元件操作控制

考慮的點

UI 要能夠在 pc browser, mobile browser 上通用，或是只需要最少的修改

最基本就是按鈕式，所有的東西event 都靠一個圖標，onclick來完成

* implement 簡單
* 通用，任何的event 基本上都可以用
* 操作動作簡單
* 有時候不知道click的event 到底做了什麼
* click到底有沒有做，需要額外display元件來check
* 可能repeat fire
* 對於重覆的資料，每個資料的button 也要重複

拖曳式 drag and drop

* 操作直覺，user 
* 比較適用subset 類的event。不適合執行類的event
* ... 特性基本上和按鈕式相反
* drag 到drop 的距離需要在整個螢幕內。如果在螢幕外，就算有自動滑動螢幕得以完成操作，也會變的很不直覺
  * 這放大螢幕差距，大螢幕可以塞進所有data會比button 好操作，小螢幕可能塞不進所有data 結果還不如button。
  * 透過有時候會顯示的fixed property object 做為dop zone 來讓drag and drop 的操作在螢幕內，等效就是把data塞進螢幕裡。
  * 或許螢幕外的操作可以用暫存區之類的補強

## display

open 箱子 pop up 式



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

5/29

很久沒弄，新改了client+ server directory

electron 弄成 if 執行

正想從API 下手 (local storage ver)，但是界面很亂

首先應該先refine 界面，有先不必要的，同時design 風格。

接著refactor code ，原本是完全沒有component base

5/30

今天大致的弄了mission 的 style, refactor, animate，接下來要考慮一下api, db 和 redux。特別是如果一直困在style，感覺沒完沒了，應該把整個core功能都弄好再說。

6/5

弄好db了，接下來弄API

6/6

今天發現image 一直有error，原來是因為用了react-router

[Serving Apps with Client-Side Routing](https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing)

6/7

一個大麻煩，Oauth 不能cros。所以我要改完之後立刻build，然後馬上copy到server/build。我用react-rewire 把dev server 的設定改成writeToDisk，這讓npm start 就像 npm build watch mode。然後在webpack 的設定使用fileManagerPlugin 去copy build 裡的data 到server/build。

另一個方法是不copy，express 的use static 直接指定client 資料夾，然後nodemon watch client/build。但是這超出server folder所以不推。

[How to create multiple output paths in Webpack config](https://stackoverflow.com/questions/35903246/how-to-create-multiple-output-paths-in-webpack-config/59019896#59019896)

unuseful

* [react-app-rewire-build-dev](https://github.com/raodurgesh/react-app-rewire-build-dev#readme)
  * 沒更新，但有提供最新解
* [cra-build-watch](https://github.com/Nargonath/cra-build-watch#readme)
  * 一直顯示error resource lock

再來是我希望browser 也能auto refresh

要能 livereload refresh，必須用livereload cli 開server，然後browser有對應。但是我已經開express server 好像沒有proxy 的option?

另一個是直接在express 裡插入middleware (prefer)，我是用[easy-livereload](https://www.npmjs.com/package/easy-livereload)，但是一直顯示websocket 連不上

ERR_CONNECTION_REFUSED

目前放棄 livereload

改用gulp + browser sync 後 ~~還是有error~~ ，

> in chrome
>
> webpackHotDevClient.js:60 WebSocket connection to 'ws://localhost:8080/sockjs-node' failed: Connection closed before receiving a handshake response
>
> 事後證明，這是因為我的 build watch mode 是用webpack devser 假裝的，build的內容可能留下一些給devServer 用的東西。

但是已經會自動reload，不過reload 之後是跳回root page。花了一天，結果差不多... 不過，gulp 真的值得學一下。

---

好像事實上是可以直用proxy 開dev server的？？ 結果確實是可以開proxy，但是redirect 就會從port3000(client) 轉到port 4000 (server)，而且proxy 好像不能直接setcookie? [webpack-dev-server set cookie via proxy](https://stackoverflow.com/questions/56377371/webpack-dev-server-set-cookie-via-proxy) 。轉到port 4000 後也就不會auto reload了

---

結論，目前的 watch mode build還有瑕疵。gulp auto reload 雖然無法直接是default page但也很近了。

是否用cra+rewire 值得考慮，或許直接download default webpack config 是更好的選擇。

其實我最後有點上頭了，直接用f5 refresh 就好，偏偏要auto refresh。

6/8

補充如何知道到底有沒有login，因為oauth 的cookie setting 是完全不經過browser的js 的

[How to check if user is logged in or not with “Google Sign In” (OAuth 2.0)](https://stackoverflow.com/questions/38083568/how-to-check-if-user-is-logged-in-or-not-with-google-sign-in-oauth-2-0)

簡單來說就是用custom 的cookie去記錄。更好的方法是用 `isSignedIn.get()` 直接問。透過這個加上redux就能確定是否要顯示login or logout button

6/9

今天完成最基本的dispatch action--> calling api--> store at in store --> component connect to state --> use state to render。所以目前整個project 所需要的基本技術已經齊全。接下來是補全所有功能，這實際上還是遇到很多修正，特別是我的UI事實上還不足實際使用。接下來的流程是，**確立UI，同步完成核心功能**（create, delet 工作, create, delet today work）。

接下來一週是期末考，所以我必須暫停，事實證明，我一週半是做不完這個project的，而且離完成還很多。之後的shedule要把這些也考慮進去。

6/17

重新開始

6/19

today event, local process



`git restore --source=HEAD --staged --worktree -- ./server`