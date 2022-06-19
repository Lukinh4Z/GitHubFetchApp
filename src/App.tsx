import { Button, Card, CardActions, createTheme, TextField, Typography } from "@mui/material";
import { Container } from '@mui/system';
import { AnyArray } from "immer/dist/internal";
import React, { useState } from "react";

export const App: React.FC = () => {
  const [user, setUser] = useState<string>('')
  const [name, setName] = useState<string | null>('')
  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [repos, setRepos] = useState<AnyArray | null>(null)


  async function fetchRepos() {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch(`https://api.github.com/users/${user}/repos`);
      const json = await response.json();
      if (json.length > 0) {
        setRepos(json);
        setName(user);
      } else {
        setRepos(null)
        setName(json.message)
      }
    }
    catch (errorMSG) {
      setError("Erro");
      console.log(errorMSG);
      console.log(error);
      setRepos(null);
      setName(null)
    } finally {
      setLoading(false)
    }
  }

  const theme = createTheme({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#111f7284',
        dark: '#0e214d',
        contrastText: '#fff'
      }
    },
  });

  return (
    <Container sx={{ alignItems: 'center', textAlign: "center", display: "flex", flexDirection: "column", alignContent: "center" }}>
      <Typography variant="h2" sx={{ color: theme.palette.primary.contrastText, margin: "1.5rem" }}>Search Git Repository</Typography>
      <Card sx={{ backgroundColor: "#777", margin: "0 0 1.5rem" }}>
        <form style={{ alignItems: "center", margin: "1rem", padding: "1rem", width: "200px" }} onSubmit={(e) => {
          e.preventDefault();
          fetchRepos()
        }}>
          <TextField id="filled-basic" label="Username" variant="filled" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Input a username..."></TextField>
          <p></p>
          <Button type="submit" variant="contained">Search</Button>
        </form>
      </Card>
      {loading && <Typography variant="h4" sx={{ color: theme.palette.primary.contrastText }}>Loading, please wait...</Typography>}
      {!loading && name && <Typography variant="h4" sx={{ color: theme.palette.primary.contrastText }}>See profile: <a href={`https://github.com/${name}`} target="_blank">{name}</a></Typography>}
      <Container sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", justifyContent: "center", flexWrap: "wrap" }}>
        {!error && !loading && repos && repos.map(repo => (
          <Card key={repo.name} sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.dark, display: "flex", justifyContent: "space-between", textAlign: "left", margin: "1rem", padding: "1.5rem" }}>
            Name: {repo.name}<br />
            Forks: {repo.forks}<br />
            Language: {repo.language}<br />
            <CardActions sx={{ alignSelf: "right", alignContent: "center", textAlign: "center" }}><Button href={repo.html_url} size="small" target="_blank">Link</Button></CardActions></Card>
        ))}
      </Container>
    </Container >
  );
};
