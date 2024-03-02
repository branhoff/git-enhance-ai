import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import {useQuery, useMutation} from '@tanstack/react-query';
import { useState } from 'react';
import { DisplayCommit } from './DisplayCommit';

const hostUrl = "http://127.0.0.1:5000";

interface BranchesProps {
    url: string;
}
export function Branches(props: BranchesProps) {
      // const queryClient = useQueryClient()
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const { status, data, error, isFetching } = useQuery<Array<string>>({
    queryKey: ['branches', props.url],
    queryFn: async () => {
      // const response = await fetch('http://localhost:5000/branches')
      // return response.json()
      // https://github.com/second-opinion-ai/second-opinion.git
      // https://github.com/second-opinion-ai/second-opinion/tree/main
      let urlCleaned = props.url;
      if (!urlCleaned || urlCleaned === "")
        throw new Error("Invalid URL! Please enter a URL.");
      if (urlCleaned.startsWith("git@github.com:"))
        urlCleaned = urlCleaned.replace("git@github.com:", "https://github.com/");
    // check if the url is a valid url
    // const url1 = new URL(urlCleaned);
    // console.log("URL", url1);
   
      // if (!urlCleaned.startsWith("https://github.com"))
      // throw new Error("Invalid URL! Only github.com URLs are supported at this time");
      urlCleaned = urlCleaned.endsWith("/") ? urlCleaned.slice(0, -1) : urlCleaned;
      urlCleaned = urlCleaned.endsWith(".git") ? urlCleaned.replace('.git', '') + '/e/e' : urlCleaned;
      
      const [givenUsername, givenRepo, _1, _2] = urlCleaned.split("/").slice(-4);
      const rb = `https://api.github.com/repos/${givenUsername}/${givenRepo}/branches`;
    //   return fetch(rb);
      const response = await fetch(rb);
      console.log("RESPONSE", response);
      const jsonVal = await response.json();
      console.log("RESPONSE", jsonVal);
      return jsonVal.map((branch: any) => branch.name);
    //   return new Promise(resolve => 
    //     setTimeout(() => resolve(["master", "dev"]), 5000)
    //   );
    },
  })

  const mutation = useMutation<string, Error, string>(
    {
      mutationFn: async (branch: string) => {
        const response = await fetch(`${hostUrl}/generate-diff-from-url`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ git_url: props.url, branch_name: branch}),
        })
        return response.json()
        // return new Promise(resolve => 
        //   setTimeout(() => resolve(`RAndom commit message example
        //   selected for testing, TODO: replace`), 5000)
        // );        

      },
      onSuccess: () => {
        // queryClient.invalidateQueries('branches')
      },
    }
  )

  if (isFetching) {
    return <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: 5
        }}>
        <CircularProgress />
    </Box>
  }

  if (status === 'error') {
    return <div>Error: {JSON.stringify(error?.message)}</div>
  }
  /**
   * Return a list of branches
   * <Paper sx={{
    padding: 2,
    margin: 2
  }}>
   */
  return  <Stack spacing={4}>
    <Typography variant="h6">Which Branch Are You Pulling?</Typography>
      <FormControl>
        <InputLabel id="branch-select-label">Branch</InputLabel>
        <Select
          labelId="branch-select-label"
          id="branch-select"
          value={selectedBranch}
          label="Branch"
          onChange={(e) => {
            setSelectedBranch(e.target.value as string);
          }}
        >
          {data?.map((branch) => (
            <MenuItem key={branch} value={branch}>
              {branch}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={() => {
          if (selectedBranch) {
            mutation.mutate(selectedBranch);
          }
        }}
      >
        Generate Commit
      </Button>
      {/* If mutation doesn't return an error, send what it did return to DisplayCommit */}
      {mutation.isError && <div>Error: {JSON.stringify(mutation?.error?.message)}</div>}
      {mutation.isPending && <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: 5
        }}>
        <CircularProgress />
        </Box>
      }
     {mutation.isSuccess && <DisplayCommit commit={JSON.stringify(mutation.data)} />}
    </Stack>;
}