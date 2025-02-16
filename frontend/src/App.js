import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Import CSS file

const API_URL = "https://polling-m65n.onrender.com/polls";

function App() {
  const [polls, setPolls] = useState([]);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);

  useEffect(() => {
    const fetchPolls = async () => {
      const { data } = await axios.get(API_URL);
      setPolls(data);
    };
    fetchPolls();
    const interval = setInterval(fetchPolls, 5000);
    return () => clearInterval(interval);
  }, []);

  const createPoll = async () => {
    await axios.post(API_URL, { question, options });
    setQuestion("");
    setOptions([""]);
  };

  const vote = async (pollId, optionIndex) => {
    await axios.post(`${API_URL}/${pollId}/vote`, { optionIndex });
  };

  return (
    <div className="container">
      <h1>Polling App</h1>

      {/* Create Poll */}
      <div className="poll-form">
        <input
          className="input-field"
          placeholder="Poll Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((option, index) => (
          <input
            key={index}
            className="input-field"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
          />
        ))}
        <button className="button add" onClick={() => setOptions([...options, ""])}>
          Add Option
        </button>
        <button className="button create" onClick={createPoll}>
          Create Poll
        </button>
      </div>

      {/* Poll List */}
      {polls.map((poll) => (
        <div key={poll._id} className="poll">
          <h2>{poll.question}</h2>
          {poll.options.map((option, index) => (
            <div key={index} className="option">
              <span>
                {option.text} ({option.votes} votes)
              </span>
              <button className="vote-button" onClick={() => vote(poll._id, index)}>
                Vote
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
