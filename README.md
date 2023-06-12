- personal preference for filenames to be snake-case.

- route names and service names do not need a suffix, they already have a folder nesting which indicates it's functionality

- wrote error handling middleware. if an express route throws an error, the code execution stops. so it is important to handle errors.

- added a controller folder to segment the responsibilities in an MVC (model - view - controller) pattern.

- removed service folder because there is essentially no business folder
