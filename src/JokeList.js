import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

function JokeList({ numJokesToGet = 5 }) {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ jokes, setJokes ] = useState([]);

    useEffect(() => {
      if (!isLoading) return;
    
      const fetchJokes = async () => {
        try {
          let jokesArr = [];
          let seenJokes = new Set();
    
          while (jokesArr.length < numJokesToGet) {
            const res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" }
            });
            let { ...joke } = res.data;
    
            if (!seenJokes.has(joke.id)) {
              seenJokes.add(joke.id);
              jokesArr.push({ ...joke, votes: 0 });
            } else {
              console.log("duplicate found!");
            }
          }
          setIsLoading(false);
          setJokes(jokesArr);
        } catch (err) {
          console.error(err);
          setIsLoading(false);
        }
      };
    
      fetchJokes();
    }, [isLoading, numJokesToGet]);

    function handleVote(id, delta) {
        setJokes(jokes.map(j =>
            j.id === id ? { ...j, votes: j.votes + delta } : j
          )
        );
    }

    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);
    return (
        isLoading ? (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
        ) : (
        <div className="JokeList">
          <button
            className="JokeList-getmore"
            onClick={() => setIsLoading(true)}
          >
            Get New Jokes
          </button>
  
          {sortedJokes.map(j => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              handleVote={handleVote}
            />
          ))}
        </div>
        )
      );
}

export default JokeList;
