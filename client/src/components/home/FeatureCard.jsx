import React from 'react';
import {Card, CardContent, Typography} from '@mui/material';

export default function FeatureCard({icon, title, description}) {
    return (
        <Card elevation={8} sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                {icon}
                <Typography variant="h6" sx={{mt: 2, mb: 1}}>
                    {title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}