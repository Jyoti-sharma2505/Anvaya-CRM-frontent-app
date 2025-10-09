 # Anvaya-CRM

 # A full-stack Anvaya-CRM management app where you can lead,lead details,sales agent, and reports details.
 Built with a React frontend, Express/Node backend,and MongoDB database.

---
## Demo Link

[Live Demo](https://anvaya-crm-frontent-app.vercel.app/)

---
## Quick Start

```
git clone https://github.com/Jyoti-sharma2505/Anvaya-CRM-frontent-app.git
cd <your-repo>
npm install
npm run dev
```

---

## Technology
- React Js
- React Router
- Node Js
- Express Js
- MongoDB

---

## Framework 
- Bootstrap
- Bootstrap-icons

---

## Demo Video
Watch a walkthrough (5–7 minutes) of all major features of this app:
 [Loom Video Link] ()


 ---

 ## Features
 **Home**
 - Display a sidebar and list of all leads.
 - Quick filter and add lead.

 **Leads Details**
 - View Full leads details information (status,agent ).
 - filter by status ,agent name and sort by time.

 **Sales Agents**
 - View Full sales agents details information (name,email ).
 - Add new sales agent.

  **Reports**
 - View Full reports details information (pipeline,last-week ).
 - Show graph

 ---

 ## Api Refrence

 ## **GET /api/leads**<br/>
 List all leads<br/>
 Sample Response:
 ```
[{_id,leadName ,salesAgent ,laedSource ,leadStatus},....]
 ```

## **GET /api/leads/:id**<br/>
 Get details for one lead<br/>
 Sample Response:
 ```
[{_id,leadName ,salesAgent ,laedSource ,leadStatus}]
 ```

 ## **Post /api/leads**<br/>
 Create a new leads<br/>
 Sample Response:
 ```
{_id,leadName ,salesAgent ,laedSource ,leadStatus}
```

## Contact

For bugs or feature requests, please reach out to jyo.sharma2505@gmail.com


