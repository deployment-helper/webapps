I need to prepare an Adobe Experience manage  MCQ  for Indian students. 

Indian students are not very good with English words so you need to use as simple as possible easy words. 

I want you to provide a response in JSON format. 

The total number of questions will be 20 please provide questions one by one. 

Please provide questions in history order meaning if two development happened one in 2021 and second in 2022 so question to related development 2021 should come first and question of development 2022 should come second. 

Please heighlight content in marddown for better visiblity

Following is the JSON format that I am expecting and key have explation how to fill it. 

common english words can be used in higlish  like 

kshamata can be replace with respective english word



Provide `explanationEnSpeak` in hinglish 
```js
{
  "questionEn": "Question in english in **markdown**",
  "questionEnSpeak":"This key we are using to generate mp3 content dynamically, Chatgpt can use this key to fill above question(questionEn) key speaking version for Indian origin audience"
  "questionHi": "Question Should be in hindi language with **markdown**",
  "questionEnSpeak":"This key we are using to generate mp3 content dynamically, Chatgpt can use this key to fill above question(questionHi) key speaking version for Indian origin audience"
  "options": [
    {
      "en": "Option `1` in **hinglish** markdown",
      "speaking": "This key will be used for speaking purpose",
    },
    {
      "en": "Option `2` in **hinglish** *markdown*",
      "speaking": "This key will be used for speaking purpose",
    },
    {
      "en": "Option 3 in hinglish markdown"
      "speaking": "This key will be used for speaking purpose",
    },
    {
      "en": "Option 4 in hinglish markdown",
      "speaking": "This key will be used for speaking purpose",
      "isRight": true
    }
  ],
  "rightAnswer": {
    "en": "Option 1 in hinglish markdown",
    "speaking":"This key will be used to generate mp3 content dynamically, ChatGpt can fill this key in speaking lanage like Option xyz is correct option",
    "isRight": true
  },
  "explanationEn": "A detailed explantion in *hinglish* markdown"
  "explanationEnSpeak": "This key we are using to generate mp3 content dynamically, ChatGPt can use this key fill above explation(explanationEn) in speaking way like elaborating above content for Indian origin audidenc"
}

```


Explanation of `explanationEnSpeak` can be improved as 

Regular response: 
Operating System me commonly used process scheduling algorithm hai First-Come, First-Served, yaani FCFS. Isme jo process pehle aata hai, woh pehle execute hota hai.

Improved response: 

Operating System me commonly used process scheduling algorithm hai First-Come, First-Served, yaani FCFS. Isme jo process pehle aata hai, woh pehle execute hota hai, jese koi kaam pahele stat kiya vo pahele chalegea 


We can imporove `explanationEn` to add image programatically by adding {} as placeholder and introduce a new key in JSON have AI generated prompts as an array of string.