Video Events Logging Specification
===============================

Hive
------------

**Note:** The specified order of fields is required when logging to these tables.

---

### `csl_video_interactions`

Logs all the client actions related to video player events. The `csl` prefix should not be used when sending a log (it is prepended automagically). 

[View in Hue &raquo;](https://hue.ewr01.tumblr.net:8088/metastore/table/default/csl_video_interactions)

##### Fields

name | type | example | notes
---- | ---- | ------- | -----
ts | int | `1452395696` | | 
uuid | string | `12345678` | |
geo	| string | `CA~Port Coquitlam` | |
cts | double | `1.452395683809E12` | |
cuuid |string | `null` | |
session\_id | string	| `llsid5691ca6e20f4f7.87436264` | | 
relative\_id	| int | `85` | |
elapsed | double | `7237913.0` | | 
event | string | `conversation:open` | See notes below for values |	
event\_data | string	| `{"type":"live","vendor":"YouNow"}` | See below for format |
env	| string | `{"location":"/dashboard"}` | |

##### Event Types

event | event\_data | notes
----- | ----------- | -----
inbox:open | `{}` | | 
inbox:closed | `{}` | |
conversation:open | `{ conversationId: String, context: String }` | |
conversation:closed | `{ conversationId: String, context: String }` | | 
conversation:deleted | `{ conversationId: String }` | | 
conversation:started | `{ context: String }` | No conversationId yet when starting | 
conversation:follow | `{ blogName: String }` | |
message:sent | `{ conversationId: String, messageLength: Int, messageType: String }` | Message Type is `TEXT` or `POSTREF`) |
message:failure | | |

---

### `act_messaging`

A comprehensive GiantOctopus log of all actions that occur in the messaging service.

#### Fields

name | type | example | notes |
---- | ---- | ------- | ----- |
ts | int | `1452395696` | | 
action | int | `770` | See action types key below | 
location | string | `/dashboard` | | 
user\_id | int | `1234567` | | 
geo | string | `CA~Port Coquitlam` | |
lang | string | `en_US` | |
platform | string | `web` | (web \| ios \| android) |
msg\_length | int | `12` | |
msg\_type | string | `12` | |
from\_blog\_id | int | `246802` | |
from\_user\_id | int | `1234567` | |
to\_blog\_id | int | `1357913` | |
conversation\_id | int | `410` | NULL if this is a new conversation |
participants | string | `246802,1357913` | |
message\_hash | string | `b1dd369faebebae2a3da8fc94859ecd24f41b9af` | |
extra | string | `{ from_ip : "174.99.87.244" }` | JSON formatted, see properties below |
to\_user\_id | int | `9876543` | |

##### Action Types

action | description |
------ | ----------- |
770 | send message |
771 | new conversation |
773 | delete conversation |
774 | daily limit reached |
775 | global limit reached |
777 | service state change error |
778 | per second limit reached |
779 | per day limit reached |
780 | send post message |

##### Extra Properties

name | type
---- | ----
sending\_to\_posting\_blog | bool |
sending\_to\_posting\_parent\_blog | bool |
post\_id | string |
blog\_id | string| 
from\_ip | string |



Indefatigable (Ticks used for Graphs)
-------------------------------------

_TODO_
