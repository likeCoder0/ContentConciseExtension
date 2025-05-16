
---

# ContentConciseExtension

## Overview

This project is a cutting-edge browser extension that leverages GeminiAI and Natural Language Processing (NLP) to enhance YouTube content interaction. The extension provides:

1. **Real-time Video Summarization with Timestamps**: Generates concise and accurate summaries of YouTube videos, including timestamps to help users navigate to key moments quickly.
2. **Interactive Chatbot for Q\&A**: Allows users to ask questions about the video content and receive accurate answers in real-time.
3. **Comment Sentiment Analysis with Q\&A**: Offers an in-depth analysis of viewer comments, categorizing sentiments (positive, negative, neutral) while allowing users to ask follow-up questions to extract deeper insights.

## Features

### Video Summarization with Timestamps

* **Purpose**: Helps users save time by providing concise summaries of lengthy videos and easy navigation through timestamps.
* **Technology**: Utilizes state-of-the-art GeminiAI models to process video transcripts, generate coherent summaries, and identify timestamps for each summary point.
* **Real-time Operation**: Summarization and timestamp generation occur as the video plays, ensuring up-to-date insights.

### Interactive Chatbot for Q\&A

* **Purpose**: Enhances user engagement by enabling them to ask questions related to the video content and receive precise answers.
* **Technology**: Leverages GeminiAI models to analyze video transcripts and generate context-aware responses.
* **User Experience**: Provides a chat interface integrated into the extension for seamless interaction.

### Comment Sentiment Analysis with Q\&A

* **Purpose**: Allows content creators to understand viewer sentiment and feedback at a glance while engaging with viewer feedback through follow-up questions.
* **Technology**: Combines GeminiAI and NLP techniques to:

  * Categorize comments into positive, neutral, or negative sentiments.
  * Enable Q\&A functionality for exploring comment trends and detailed insights.

### Integration

* **Frontend**: Built with React for a seamless and dynamic user experience.
* **Backend**: Powered by Flask for efficient communication with GeminiAI models and NLP pipelines.

## Technology Stack

### Frontend

* React
* Tailwind CSS

### Backend

* Flask
* Python

### AI Models

* GeminiAI Models
* NLP libraries (e.g., NLTK, spaCy, or Hugging Face Transformers)

### Additional Tools

* REST API for model integration

## Installation Guide

### Prerequisites

* Node.js and npm installed on your system.
* Python 3.x installed.

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-repo/youtube-summarization-extension.git  
   cd youtube-summarization-extension  
   ```

2. **Install Frontend Dependencies**:

   ```bash
   cd frontend  
   npm install  
   ```

3. **Install Backend Dependencies**:

   ```bash
   cd ../backend  
   pip install -r requirements.txt  
   ```

4. **Run the Backend**:

   ```bash
   python app.py  
   ```

5. **Run the Frontend**:

   ```bash
   cd ../frontend  
   npm start  
   ```

6. **Add the Extension**:

   * Load the extension files into your browser as an unpacked extension.

## Demo Instructions

### Demo Video

Watch the demo video to see the extension in action below:

<video controls>  
  <source src="https://drive.google.com/file/d/1HmEHvhztMTow2SFhRAH6IyO3c5N7UtA5/view?usp=sharing" type="video/mp4">  
  Your browser does not support the video tag.  
</video>

### Video Summarization with Timestamps

1. Open a YouTube video.
2. Activate the extension via the browser toolbar.
3. The summary, along with timestamps, will be generated and displayed on the sidebar in real time.
4. Click on any timestamp to navigate directly to the corresponding point in the video.

### Interactive Chatbot for Q\&A

1. Open a YouTube video.
2. Activate the chatbot via the extension.
3. Ask questions related to the video content in the chat interface.
4. Receive accurate and context-aware answers instantly.

### Comment Sentiment Analysis with Q\&A

1. Navigate to the sentiment analysis tab within the extension.
2. Click on "Analyze Comments."
3. View categorized sentiments in the chatbot.
4. Use the Q\&A feature to ask detailed questions about comment trends and receive specific insights.

## Future Enhancements

* Incorporate advanced sentiment analysis for sarcasm detection.
* Enable export of summaries, chatbot Q\&A logs, and sentiment data as PDF or CSV.

---
