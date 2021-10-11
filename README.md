# Recording Indexing & Searching
This small project focuses on ingesting data from a JSON recording, indexing it, and providing a simple method of searching through it.

# Prerequisities
- Nodejs and PostgreSQL installations

# Installation And Setup
- Clone the repository 
- Edit the `.env.example` file with your preferred database settings and rename to .env
- Open the project directory and run `npm install`

# Run the Project
`node index`


# Endpoints
- To ingest and index chat (delta) messages

  `POST /content/chat`
  
 - To ingest and index video (av) recording
  
    `POST /content/video`
  
 - To search for content
 
    `GET/content?keywords=hello`
  
    for more than one keywords, separate with coma (,) e.g `keywords=hello,world`
  
  


