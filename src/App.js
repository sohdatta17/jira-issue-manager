import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';

function App() {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [issuetype, setIssuetype] = useState("Task");
  const [message, setMessage] = useState("");
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState("");

  // Check Jira connection
  const checkConnection = async () => {
    try {
      const response = await axios.get("https://jira-connect.vercel.app/domain-check");
      setStatus(response.data.message);
    } catch (error) {
      setStatus("❌ Connection failed!");
    }
  };

  useEffect(() => {
    checkConnection(); // Check connection on mount
  }, []);

  // Fetch issues from Jira
  const fetchIssues = async () => {
    try {
      const response = await axios.get("https://jira-connect.vercel.app/fetch-issue");
      setIssues(response.data.issues);
    } catch (error) {
      setMessage("Failed to fetch issues!");
    }
  };

  // Handle issue creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://jira-connect.vercel.app/create-issue", {
        summary,
        description,
        issuetype,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
      setMessage("❌ Failed to create issue!");
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f4f7fa" }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: "#3b3b3b" }}>Jira Issue Manager in My JIRA PROJECT</Typography>

      <Typography variant="h6" sx={{ color: "#444" }}>Connection Status</Typography>
      <Button variant="contained" onClick={checkConnection} sx={{ marginBottom: 2 }}>Check Connection</Button>
      {status && <Typography variant="body1">{status}</Typography>}

      <hr />

      <Typography variant="h6" sx={{ color: "#444" }}>Create an Issue</Typography>
      <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <TextField
          label="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Issue Type</InputLabel>
          <Select
            value={issuetype}
            onChange={(e) => setIssuetype(e.target.value)}
            label="Issue Type"
          >
            <MenuItem value="Task">Task</MenuItem>
            <MenuItem value="Bug">Bug</MenuItem>
            <MenuItem value="Story">Story</MenuItem>
            <MenuItem value="Epic">Epic</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained">Create Issue</Button>
      </form>
      {message && <Typography variant="body1" sx={{ marginTop: 2 }}>{message}</Typography>}

      <hr />

      <Typography variant="h6" sx={{ color: "#444" }}>Issues</Typography>
      <Button variant="contained" onClick={fetchIssues} sx={{ marginBottom: 2 }}>Fetch Issues</Button>
      {issues.length === 0 ? (
        <Typography variant="body1">No issues found.</Typography>
      ) : (
        <ul>
          {issues.map((issue) => (
            <li key={issue.key}>
              <Typography variant="body1">
                <strong>{issue.key}</strong>: {issue.fields.summary}
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
}

export default App;
