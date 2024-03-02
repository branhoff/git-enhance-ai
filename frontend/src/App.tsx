import { useState } from "react";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Alert, Button, Container, CssBaseline, Stack, TextField, ThemeProvider, createTheme } from "@mui/material";
import { Branches } from "./Branches";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

// Create a client
const queryClient = new QueryClient();

function ChatDisplay() {
  const [url, setUrl] = useState<string | null>(null);
  const [urlControl, setUrlControl] = useState("");

  /**
   * App that displays an MUI input box for a github url
   * an mui dropdown once that url is entered
   * and a button to submit the form
   */
  return (
    <Stack spacing={2}>
      <TextField
        value={urlControl}
        onChange={(e) => {
          //e.preventDefault();
          setUrlControl(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setUrl(urlControl);
          }
          
        }}
        id="outlined-basic"
        label="Your Git URL"
        variant="outlined"
      />
      {/* <Button
        onClick={() => {
          setUrl(urlControl);
        }}
        variant="contained"
      >Get Branches</Button> */}
      {url && <Branches url={url} />}
    </Stack>
  );
}

function App() {
  return (
    <>
        <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <QueryClientProvider client={queryClient}>
          <ChatDisplay />
        </QueryClientProvider>
      </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
