const express = require('express'); // Importing express
const fs = require('fs'); // Importing File System (fs) module
const path = require('path'); // Importing path module

const app = express(); // Initialising express app

app.use(express.json()); // Using express.json() method


// Function to create a text file
const createTextFileFun = (req, res) => {

    try{
        // Creating the current timestamp, and converting into string (with the same format)
        const currentTimestamp = new Date().toISOString();

        // Creating current timestamp string in Indian Standard Time (IST) format
        const currentTimestampIST = new Date().toString();

        // File name in the format of current date-time
        const fileName = currentTimestamp.replace(/[-:.]/g,'').replace('T', '-').replace('Z', '');

        // Content (string) of the text file (both current time stamp in original and IST formats)
        const content = `The current timestamp is: ${currentTimestamp}. The current timestamp in IST is: ${currentTimestampIST}.`;

        // Mentioning the folder path
        const folderPath = './textFiles';

        // Creating the folder if i does not exist
        if(!fs.existsSync(folderPath)){
            fs.mkdirSync(folderPath);
        }

        // Creating file path
        const filePath = path.join(folderPath, `${fileName}.txt`);

        // Creating text file and writing the content in it
        fs.writeFile(filePath, content, (err) => {
            if(err){
                return res.status(400).send({message: 'Failed to create a text file.', error: err.message});
            }
            res.status(200).send({message:'Text file is created successfully.'});
        });
    }catch(error){
        res.status(500).send({message: "Internal server error."});
    }
}


// Function for getting all text files in the "textFiles" folder
const getAllTextFiles = (req, res) => {
    try{
        // Folder path
        const folderPath = './textFiles';

        // Reading the folder
        fs.readdir(folderPath, (err, files) => {
            if(err){
                return res.status(400).send({message: "Failed to read the folder.", error: err.message});
            }
            // Foltering all the files with .txt as extention
            const allTextFiles = files.filter(file => path.extname(file) === ".txt");

            // Sending response message along with the list of text files
            res.status(200).send({message: "All the text files in the 'textFiles' folder are:", textFiles: allTextFiles});
        });

    }catch(error){
        res.status(500).send({message: "Internal server error."})
    }
}


// For welcome text
app.get('/', (req, res) => {
    res.status(200).send("Welcome!! The path for creating text file is 'url/api/createTextFile'. The path for getting all text files is 'url/api/getAllTextFiles'.");
});

// POST call for creating text file
app.post('/api/createTextFile', createTextFileFun);
// GET call for getting all text files
app.get('/api/getAllTextFiles', getAllTextFiles);

// Listening to app
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on the PORT ${PORT}`);
})