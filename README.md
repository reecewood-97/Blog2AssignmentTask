//Read me doc 

The features we decided to add to the basic skeleton that was provided were the User Authentication feature which prompts the user to register and log in upon first arrival on to the platform, and the blog post management feature that allows users to search and fiter blog posts via a dropdown.

Team Contributions

Joint responsibilities 

As a team we had to decide which softwares we wanted to use and how we would collaborate effectivley on this project, 
settling on jacascript, express, sql and sequelize for the softwares and finally github codespaces to allow us to work 
together. Using commits and git commands such as git pull and push to manage our workload as effective as possible. 
Additionally the initial planning phase was joint as we settled on the features we wanted to implement and how we should 
approach them, aswell as types of testing we wanted to use whether it be TDD, BDD or both, in the end we settled on both 
as this gave out platform extra assurances by covering different possibilities. It is also worth adding that as we worked 
on this mostly in person the coing although seperated was a joint effort also.
 
Ethan my responsibilties were to add the blog management feature and the relevant tests for this feature. 
in summary this feature allows users (once logged in) to filter for bog posts by date posted and alphabetical order
,aswell as a search bar, something similar to other blog apps seen nowadays. It will let the user know if blogs dont 
match their search and prompt them to search again . This feature was added to give the user more accesibility on the 
app and improve overall UX

Reece my responsibilities were to add the User authentication feature and relevant tests for this feature. In summary this feature 
enhances both app security and user experience by prompting the user to make and account a login. This will ensure that the
users app will be personalised to them and allow them to attach their profile to the posts that they make. Other features are for exmaple when creating a password it must have more than 6 characters. this further enhances the security of the platfrom. bcyrpt was used for the passwords

Setup Instructions

to run the app simply input npm start into the terminal and this will take you to our home page, along the header 
you will see an option to "register". Once clicked on you will be prompted to add a username, email, password and to 
confirm that pasword. The system will remember your login details and input them for you next time you load up the app. From there 
you can navigate through the app using "create posts" to add you posts and the search functionality to filter through them. You 
can also view posts made my other users in this instance between myself and reece and filter through those aswell.

Evidence is linked below underneath each subheading directly related to the rubric 

Feature implementation:

Blog Management Feature
screenshot showing the index.js file that manages the database connection and imports models https://drive.google.com/file/d/1ApHOyRoGpbYxRWp8DW8E1L9utl_5tIo8/view?usp=drive_link
screenshot showing the blog.js file that has majority of the code for this feature https://drive.google.com/file/d/1wC75XI3CWgSBIl2rU0732ruMziCZX01D/view?usp=drive_link
screenshotof index.pug that takes care of the front end for this feature https://drive.google.com/file/d/114gA8RXbn4N0vf1UzdQfDoOqigSmC7cB/view?usp=drive_link

User Authentication Feature 



Testing 

add links 


Security Enhancements
error when password is incorrect https://drive.google.com/file/d/1R6UZb5YRBcIaFvfymcqmVDZ5PnabFi3F/view?usp=drive_link
error when user tries to create password with less than 6 characters https://drive.google.com/file/d/1mvQtyoKeilbgNonJm94aX0tEHfBPLbLv/view?usp=drive_link
error showing the user their email isnt registered https://drive.google.com/file/d/1r1s-STaf0qna9LRF3WHlC4NigH91Nbaq/view?usp=drive_link

Code Quality and Refactoring 



Git Practices
link to show commits being used aswell as seperate branches to work on code https://drive.google.com/file/d/1VRxkIHpNntFWA3Wb0S0tp4v5ILiXXLCj/view?usp=drive_link!