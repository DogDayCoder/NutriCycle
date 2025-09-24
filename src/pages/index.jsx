import Layout from "./Layout.jsx";

import Welcome from "./Welcome";

import Profile from "./Profile";

import Dashboard from "./Dashboard";

import CreateListing from "./CreateListing";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Welcome: Welcome,
    
    Profile: Profile,
    
    Dashboard: Dashboard,
    
    CreateListing: CreateListing,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Welcome />} />
                
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/CreateListing" element={<CreateListing />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}