I need to prepare a MCQ for Indian Student on topic of Noun, Verb and Ad verb

Indian students are not very good with English words so you need to use as simple as possible easy words. 

I want you to provide a response in JSON format. 

The total number of questions will be 20 please provide questions one by one. 

Please provide questions in history order meaning if two development happened one in 2021 and second in 2022 so question to related development 2021 should come first and question of development 2022 should come second. 

Please heighlight content in marddown for better visiblity

Following is the JSON format that I am expecting and every key have explation how to fill it. 


All `speaking key should be in english expect questionHiSpeak`


Provide `explanationEnSpeak` in English 
```json
{
  "questionEn": "Question in english in **markdown**",
  "questionEnSpeak":"This key we are using to generate mp3 content dynamically, Chatgpt can use this key to fill above question(questionEn) key speaking version for Indian origin audience"
  "questionHi": "प्रश्न को हिंदी में **मार्कडाउन** में होना चाहिए",
  "questionHiSpeak":"This key we are using to generate mp3 content dynamically, Chatgpt can use this key to fill above question(questionHi) key speaking version for Indian origin audience"
  "options": [
    {
      "en": "Option `1` in **English** markdown",
      "speaking": "This key will be used for speaking purpose",
    },
    {
      "en": "Option `2` in **English** *markdown*",
      "speaking": "This key will be used for speaking purpose",
    },
    {
      "en": "Option 3 in English markdown"
      "speaking": "This key will be used for speaking purpose",
    },
    {
      "en": "Option 4 in English markdown",
      "speaking": "This key will be used for speaking purpose",
      "isRight": true
    }
  ],
  "rightAnswer": {
    "en": "Option 1 in English markdown",
    "speaking":"This key will be used to generate mp3 content dynamically, ChatGpt can fill this key in speaking lanage like Option xyz is correct option"
  },
  "explanationEn": "A detailed explantion in *English* markdown"
  "explanationEnSpeak": "This key we are using to generate mp3 content dynamically, ChatGPt can use this key fill above explation(explanationEn) in speaking way like elaborating above content for Indian origin audidenc"
}

```

 


