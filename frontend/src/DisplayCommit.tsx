/**
 * Display the generated commit message
 */

import { Box, IconButton, Paper, Typography } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React from "react";

export function DisplayCommit(props: {commit: string}) {
    const [isHovering, setIsHovering] = React.useState(false);
    return <Box sx={{
        padding: 2,
        margin: 2
    }}>
        <Typography variant="h6">Generated Commit Message</Typography>
        <Paper sx={{
            padding: 2,
            margin: 2,
            position: 'relative',
        }
    }
    onMouseOver={(e) => setIsHovering(true) }
    onMouseOut={(e) => setIsHovering(false) }
        >
            <Typography sx={{
                padding: 2
            }} variant="body1">{props.commit}</Typography>
            {/* Floats in the top righthand corner of the paper component */}
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    opacity: isHovering ? 1 : 0.4,
                }}
                onClick={() => {
                    navigator.clipboard.writeText(props.commit);
                }}

            >
                <ContentCopyIcon />
            </IconButton>
        </Paper>
    </Box>
}
