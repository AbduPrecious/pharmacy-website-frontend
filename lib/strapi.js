import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

const strapi = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const getMenus = async () => {
  try {
    const response = await strapi.get('/api/menus?populate=*');
    return response.data;
  } catch (error) {
    console.error('Error fetching menus:', error);
    return null;
  }
};

export const getAboutUs = async () => {
  try {
    const response = await strapi.get('/api/about-us?populate[values][populate]=icon&populate[missionIcon]=*&populate[visionIcon]=*&populate[qualityImage]=*&populate[leadersImage]=*&populate[leaderFollowImage]=*&populate[isoCertificates][populate]=image&populate[milestoneImage]=*&populate[groupCompanies][populate]=logo&populate[partners][populate]=logo&populate[welcomeImage]=*');
    return response.data;
  } catch (error) {
    console.error('Error fetching about us:', error);
    return null;
  }
};