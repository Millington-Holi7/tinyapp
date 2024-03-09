# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

#### I created this home page to be inviting with the gif but still following the layout of the rest of the pages. I only have the register and login showing. One way to stop people from being able to access the pages unless they are signed in.

(#![alt text](login-page.png))



#### My urls list. Only shows ones added by the user logged in. You can edit the longURL by selecting the Edit button. It will take you to the url page where you can edit the longURL. If you select the delete button,it will delete the whole entry.

[alt text](/docs/urls-page.png)



#### This page shows the longURL inserted to make the shortURL. The short URL is a link to the actual site the longURL is for. Edit how the longURL appears in the list. 
[alt text](docs/url-id-page.png)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.