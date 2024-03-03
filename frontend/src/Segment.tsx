import { Box } from "@mui/material";

export function Segment(props: { children: React.ReactNode }) {
    return (
        <Box sx={{
            border: 1,
            borderColor: "grey.500",
            borderRadius: 1,
            padding: 1,
            margin: 1,
            minWidth: 300,
        }}>
        {props.children}
        </Box>
    );
}