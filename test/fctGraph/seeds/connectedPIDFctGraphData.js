/* eslint-disable */
module.exports = {
  "deviceDefault":false,
  "deviceId":"c1d5722b-4449-46a0-99a2-052a6bda1926",
  "functionalities":[
     {
        "id":"3243a72d-6d3b-45b6-9be5-5489ba305c62",
        "isVirtual":false,
        "name":"circuit",
        "slots":[
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"b8eb71c2-df5d-4d1d-9830-9a21c5b6989c",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"value in",
                    "sourceFctId":"3243a72d-6d3b-45b6-9be5-5489ba305c62",
                    "sourceSlotName":"Celsius Out"
                 }
              ],
              "dataType":"float",
              "displayType":"temperature",
              "name":"Celsius Out",
              "type":"OutSlot",
              "unit":"°C"
           }
        ],
        "subType":"TemperatureSensor",
        "type":"Sensor"
     },
     {
        "id":"13504539-93f3-4b2b-a072-f31a5453d118",
        "isVirtual":false,
        "name":"TemperaturePIDController",
        "slots":[
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"7c050871-38f4-4c03-a307-ff1cd12ff5af",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"P",
                    "sourceFctId":"9dddc7f0-3658-462b-a6cd-00cce8e0dcdb",
                    "sourceSlotName":"P"
                 }
              ],
              "dataType":"float",
              "defaultValue":-33.06,
              "displayType":"controller parameter",
              "max":54.92,
              "min":-40.61,
              "name":"P",
              "tareable":true,
              "type":"InSlot",
              "unit":"-"
           },
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"929bcf4f-eb83-4884-a1cc-2a95994e49de",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"I",
                    "sourceFctId":"3a341065-02f7-40bf-9976-9ce20b0239dc",
                    "sourceSlotName":"I"
                 }
              ],
              "dataType":"float",
              "defaultValue":58.65,
              "displayType":"controller parameter",
              "max":110.35,
              "min":-3.37,
              "name":"I",
              "tareable":true,
              "type":"InSlot",
              "unit":"-"
           },
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"c6753331-df1a-497a-bfc7-ebe12b57a931",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"D",
                    "sourceFctId":"9b988373-b23c-4375-b2e8-962c470298f7",
                    "sourceSlotName":"D"
                 }
              ],
              "dataType":"float",
              "defaultValue":-33.82,
              "displayType":"controller parameter",
              "max":36.57,
              "min":-74.01,
              "name":"D",
              "tareable":true,
              "type":"InSlot",
              "unit":"-"
           },
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"47874b3d-836f-481b-8872-edc1f4ddc7a7",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"target in",
                    "sourceFctId":"2ad9cb7c-f40a-4cd1-9793-7f51effba459",
                    "sourceSlotName":"target in"
                 }
              ],
              "dataType":"float",
              "defaultValue":10.38,
              "displayType":"temperature",
              "max":82.99,
              "min":-27.16,
              "name":"target in",
              "tareable":true,
              "type":"InSlot",
              "unit":"°C"
           },
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"b8eb71c2-df5d-4d1d-9830-9a21c5b6989c",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"value in",
                    "sourceFctId":"3243a72d-6d3b-45b6-9be5-5489ba305c62",
                    "sourceSlotName":"Celsius Out"
                 }
              ],
              "dataType":"float",
              "defaultValue":54.35,
              "displayType":"flow",
              "max":74.03,
              "min":9.59,
              "name":"value in",
              "tareable":false,
              "type":"InSlot",
              "unit":"°C"
           },
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"4a8cda58-fce5-45dd-a977-bb58c44357f4",
                    "sinkFctId":"65a769b5-da80-4421-8370-3f1ce531b48a",
                    "sinkSlotName":"Celsius In",
                    "sourceFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sourceSlotName":"value out"
                 }
              ],
              "dataType":"float",
              "displayType":"temperature",
              "name":"value out",
              "type":"OutSlot",
              "unit":"°C"
           }
        ],
        "subType":"PIDController",
        "type":"Controller"
     },
     {
        "id":"65a769b5-da80-4421-8370-3f1ce531b48a",
        "isVirtual":false,
        "name":"Celsius Heater",
        "slots":[
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"4a8cda58-fce5-45dd-a977-bb58c44357f4",
                    "sinkFctId":"65a769b5-da80-4421-8370-3f1ce531b48a",
                    "sinkSlotName":"Celsius In",
                    "sourceFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sourceSlotName":"value out"
                 }
              ],
              "dataType":"float",
              "defaultValue":30.51,
              "displayType":"flow",
              "max":78.54,
              "min":-35.03,
              "name":"Celsius In",
              "tareable":false,
              "type":"InSlot",
              "unit":"°C"
           }
        ],
        "subType":"HeaterActuator",
        "type":"Actuator"
     },
     {
        "id":"9dddc7f0-3658-462b-a6cd-00cce8e0dcdb",
        "isVirtual":true,
        "name":"Push In",
        "slots":[
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"7c050871-38f4-4c03-a307-ff1cd12ff5af",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"P",
                    "sourceFctId":"9dddc7f0-3658-462b-a6cd-00cce8e0dcdb",
                    "sourceSlotName":"P"
                 }
              ],
              "dataType":"float",
              "displayType":"controller parameter",
              "name":"P",
              "type":"OutSlot",
              "unit":"-"
           }
        ],
        "source":{
           "name":"ospin-webapp"
        },
        "subType":"PushIn",
        "type":"InputNode"
     },
     {
        "id":"3a341065-02f7-40bf-9976-9ce20b0239dc",
        "isVirtual":true,
        "name":"Push In",
        "slots":[
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"929bcf4f-eb83-4884-a1cc-2a95994e49de",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"I",
                    "sourceFctId":"3a341065-02f7-40bf-9976-9ce20b0239dc",
                    "sourceSlotName":"I"
                 }
              ],
              "dataType":"float",
              "displayType":"controller parameter",
              "name":"I",
              "type":"OutSlot",
              "unit":"-"
           }
        ],
        "source":{
           "name":"ospin-webapp"
        },
        "subType":"PushIn",
        "type":"InputNode"
     },
     {
        "id":"9b988373-b23c-4375-b2e8-962c470298f7",
        "isVirtual":true,
        "name":"Push In",
        "slots":[
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"c6753331-df1a-497a-bfc7-ebe12b57a931",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"D",
                    "sourceFctId":"9b988373-b23c-4375-b2e8-962c470298f7",
                    "sourceSlotName":"D"
                 }
              ],
              "dataType":"float",
              "displayType":"controller parameter",
              "name":"D",
              "type":"OutSlot",
              "unit":"-"
           }
        ],
        "source":{
           "name":"ospin-webapp"
        },
        "subType":"PushIn",
        "type":"InputNode"
     },
     {
        "id":"2ad9cb7c-f40a-4cd1-9793-7f51effba459",
        "isVirtual":true,
        "name":"Push In",
        "slots":[
           {
              "dataStreams":[
                 {
                    "averagingWindowSize":0,
                    "id":"47874b3d-836f-481b-8872-edc1f4ddc7a7",
                    "sinkFctId":"13504539-93f3-4b2b-a072-f31a5453d118",
                    "sinkSlotName":"target in",
                    "sourceFctId":"2ad9cb7c-f40a-4cd1-9793-7f51effba459",
                    "sourceSlotName":"target in"
                 }
              ],
              "dataType":"float",
              "displayType":"temperature",
              "name":"target in",
              "type":"OutSlot",
              "unit":"°C"
           }
        ],
        "source":{
           "name":"ospin-webapp"
        },
        "subType":"PushIn",
        "type":"InputNode"
     }
  ],
  "id":"22c45426-711b-45af-bc60-e2f711d68c6a",
  "name":"Dynamic"
}
