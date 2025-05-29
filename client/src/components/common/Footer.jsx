import React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Link,
    IconButton,
    Divider,
    Paper
} from '@mui/material';
import {
    Facebook,
    Twitter,
    Instagram,
    LinkedIn,
    Email,
    Phone,
    LocationOn
} from '@mui/icons-material';
import logoSvg from '/logo/logo.svg'

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            {label: 'About Us', href: '/about'},
            {label: 'Contact', href: '/contact'},
            {label: 'Terms Of Service', href: '/tos'},
            {label: 'Privacy Policy', href: '/privacy-policy'}
        ]
    };

    const socialLinks = [
        {icon: <Facebook/>, href: 'https://facebook.com', label: 'Facebook'},
        {icon: <Twitter/>, href: 'https://twitter.com', label: 'Twitter'},
        {icon: <Instagram/>, href: 'https://instagram.com', label: 'Instagram'},
        {icon: <LinkedIn/>, href: 'https://linkedin.com', label: 'LinkedIn'}
    ];

    return (
        <Paper
            component="footer"
            elevation={4}
            sx={{
                mt: 'auto',
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 0,
                pt: 6,
                pb: 3
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box sx={{mb: 3}}>
                            <Typography variant="h5" component="div" sx={{
                                fontWeight: 'bold',
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <img
                                    src={logoSvg}
                                    alt="RentEvent Logo"
                                    height="32"
                                    style={{filter: 'brightness(0) invert(1)'}}
                                />
                                RentEvent
                            </Typography>
                            <Typography variant="body2" color="grey.300" sx={{mb: 3}}>
                                Your comprehensive assistant for organizing events.
                                Connect venue owners with event organizers seamlessly.
                            </Typography>

                            <Box sx={{mb: 2}}>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <Email sx={{fontSize: 16, mr: 1, color: 'white'}}/>
                                    <Typography variant="body2" color="grey.300">
                                        contact@rentevent.com
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                                    <Phone sx={{fontSize: 16, mr: 1, color: 'white'}}/>
                                    <Typography variant="body2" color="grey.300">
                                        +48 123 456 789
                                    </Typography>
                                </Box>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <LocationOn sx={{fontSize: 16, mr: 1, color: 'white'}}/>
                                    <Typography variant="body2" color="grey.300">
                                        Cracow, Poland
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4} md={2}>
                        <Typography variant="h6" sx={{mb: 2, fontWeight: 'bold'}}>
                            Company
                        </Typography>
                        <Box>
                            {footerLinks.company.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    color="grey.400"
                                    underline="hover"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        '&:hover': {color: 'secondary.main'}
                                    }}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" sx={{mb: 2, fontWeight: 'bold'}}>
                            Follow Us
                        </Typography>
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                            {socialLinks.map((social, index) => (
                                <IconButton
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        color: 'grey.400',
                                        '&:hover': {
                                            color: 'secondary.main',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{my: 4, borderColor: 'grey.700'}}/>

                <Typography variant="body2" color="grey.400" textAlign="center">
                    © {currentYear} RentEvent. All rights reserved.
                </Typography>

            </Container>
        </Paper>
    );
}