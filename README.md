# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

#### I created this home page to be inviting with the gif but still following the layout of the rest of the pages. I only have the register and login showing. One way to stop people from being able to access the pages unless they are signed in.

!["Screenshot of login page"](https://github.com/Millington-Holi7/tinyapp/blob/master/docs/login-page.png?raw=true)



#### My urls list. Only shows ones added by the user logged in. You can edit the longURL by selecting the Edit button. It will take you to the url page where you can edit the longURL. If you select the delete button,it will delete the whole entry.

!["Screenshot of urls page"](https://github.com/Millington-Holi7/tinyapp/blob/master/docs/urls-page.png?raw=true)



#### This page shows the longURL inserted to make the shortURL. The short URL is a link to the actual site the longURL is for. Edit how the longURL appears in the list. 

!["Screenshot of urls/:id page"](https://github.com/Millington-Holi7/tinyapp/blob/master/docs/url-id-page.png?raw=true)



## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.