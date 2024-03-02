import { useState } from "react";
import {
  Stack,
  TextField
} from "@mui/material";
import { Branches } from "./Branches";

export function ChatDisplay() {
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
        variant="outlined" />
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
