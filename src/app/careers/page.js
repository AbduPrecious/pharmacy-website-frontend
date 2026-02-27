'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import Navigation from '../components/Navigation';

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    location: '',
    phoneNumber: '',
    secondaryPhone: '',
    email: '',
    secondaryEmail: '',
    profession: '',
    currentJobTitle: '',
    yearsExperience: '',
    industry: '',
    careerLevel: '',
    educationLevel: '',
    fieldOfStudy: '',
    salaryRange: '',
    otherLanguages: false,
    languageExplanation: '',
    hasRelationship: false,
    hasRelative: false,
    cv: null,
    coverLetter: null
  });
  
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [footer, setFooter] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  useEffect(() => {
    fetchJobs();
    fetchFooter();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/jobs?filters[isActive][$eq]=true&sort=order:asc`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) {
        setJobs(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const extractText = (richText) => {
    if (!richText) return '';
    if (typeof richText === 'string') return richText;
    if (Array.isArray(richText)) {
      return richText.map(block => 
        block.children?.map(child => child.text).join(' ') || ''
      ).join(' ');
    }
    return '';
  };

  const fetchFooter = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/site-footer?populate[branchLocations][populate][0]=phones&populate[branchLocations][populate][1]=emails&populate[footerLinks]=*&populate[socialPlatforms]=*`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      if (response.data?.data) setFooter(response.data.data);
    } catch (error) {
      console.error('Error fetching footer:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const applicationData = {
        fullName: formData.fullName,
        gender: formData.gender === 'male' ? 'Male' : 
                formData.gender === 'female' ? 'Female' : 'Other',
        dateOfBirth: formData.dateOfBirth,
        location: formData.location,
        phoneNumber: formData.phoneNumber,
        secondaryPhone: formData.secondaryPhone || null,
        email: formData.email,
        secondaryEmail: formData.secondaryEmail || null,
        profession: formData.profession,
        currentJobTitle: formData.currentJobTitle,
        yearsExperience: parseInt(formData.yearsExperience) || 0,
        industry: formData.industry === 'healthcare' ? 'Healthcare' :
                  formData.industry === 'pharmaceutical' ? 'Pharmaceutical' :
                  formData.industry === 'medical_devices' ? 'Medical Devices' :
                  formData.industry === 'hospital' ? 'Hospital' :
                  formData.industry === 'research' ? 'Research' :
                  formData.industry === 'education' ? 'Education' : 'Other',
        careerLevel: formData.careerLevel === 'entry' ? 'Entry Level' :
                     formData.careerLevel === 'junior' ? 'Junior' :
                     formData.careerLevel === 'mid' ? 'Mid-Level' :
                     formData.careerLevel === 'senior' ? 'Senior' :
                     formData.careerLevel === 'manager' ? 'Manager' :
                     formData.careerLevel === 'director' ? 'Director' : null,
        educationLevel: formData.educationLevel === 'high_school' ? 'High School' :
                        formData.educationLevel === 'diploma' ? 'Diploma' :
                        formData.educationLevel === 'bachelors' ? 'Bachelor\'s' :
                        formData.educationLevel === 'masters' ? 'Master\'s' :
                        formData.educationLevel === 'phd' ? 'PhD' : 'Other',
        fieldOfStudy: formData.fieldOfStudy || null,
        salaryRange: formData.salaryRange === '0-5000' ? 'ETB 0-5000' :
                     formData.salaryRange === '5000-10000' ? 'ETB 5000-10000' :
                     formData.salaryRange === '10000-20000' ? 'ETB 10000-20000' :
                     formData.salaryRange === '20000-30000' ? 'ETB 20000-30000' :
                     formData.salaryRange === '30000-50000' ? 'ETB 30000-50000' :
                     formData.salaryRange === '50000+' ? 'ETB 50000+' : null,
        otherLanguages: formData.otherLanguages || false,
        languageExplanation: formData.languageExplanation || null,
        hasRelationship: formData.hasRelationship || false,
        hasRelative: formData.hasRelative || false,
        jobPosition: selectedJob?.id
      };

      const response = await axios.post(`${API_URL}/api/job-applications`, {
        data: applicationData
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Success:', response.data);
      setFormStatus('success');
      
      setTimeout(() => {
        setShowForm(false);
        setFormStatus(null);
        setFormData({
          fullName: '', gender: '', dateOfBirth: '', location: '',
          phoneNumber: '', secondaryPhone: '', email: '', secondaryEmail: '',
          profession: '', currentJobTitle: '', yearsExperience: '', industry: '',
          careerLevel: '', educationLevel: '', fieldOfStudy: '', salaryRange: '',
          otherLanguages: false, languageExplanation: '',
          hasRelationship: false, hasRelative: false,
          cv: null, coverLetter: null
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Error:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 5000);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      

      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFFF00] to-yellow-300 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-base text-gray-700 mb-4">
            <Link href="/" className="hover:text-gray-900 transition font-medium">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-800 font-semibold">Vacancy</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">Job Application</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover exciting career opportunities at Droga Pharma and be part of something great.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Current Openings */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Current Openings</h2>
          
          {jobs.length === 0 ? (
            <p className="text-center text-gray-600">No positions available at the moment. Please check back later.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-gray-100 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{job.attributes.title}</h3>
                    <p className="text-[#FFFF00] font-semibold mb-3">{job.attributes.department}</p>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="text-lg">📍</span> {job.attributes.location}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="text-lg">⏰</span> {job.attributes.type}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="text-lg">💼</span> {job.attributes.experience}
                      </p>
                      {job.attributes.salary && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <span className="text-lg">💰</span> {job.attributes.salary}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleApply(job)}
                      className="w-full bg-[#FFFF00] text-gray-800 py-3 rounded-lg font-bold hover:bg-yellow-400 transition transform hover:scale-105"
                    >
                      View Details & Apply
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Deadline: {new Date(job.attributes.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Form Modal */}
{showForm && selectedJob && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
    <div className="min-h-screen px-4 py-8">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto my-8">
        
        {/* Close button */}
        <button
          onClick={() => setShowForm(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          ✕
        </button>

        {/* Form Header */}
        <div className="bg-gradient-to-r from-[#FFFF00] to-yellow-300 p-8 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-gray-800">Apply for: {selectedJob.attributes.title}</h2>
          <p className="text-gray-700 mt-2">{selectedJob.attributes.department} • {selectedJob.attributes.location}</p>
        </div>

        {/* ===== ADDED: Job Details Section ===== */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Job Details</h3>
          
          {/* Description */}
          {selectedJob.attributes.description && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
              <div className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
                {extractText(selectedJob.attributes.description)}
              </div>
            </div>
          )}

          {/* Requirements */}
          {selectedJob.attributes.requirements && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h4>
              <div className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
                {extractText(selectedJob.attributes.requirements)}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {selectedJob.attributes.responsibilities && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Responsibilities</h4>
              <div className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-100">
                {extractText(selectedJob.attributes.responsibilities)}
              </div>
            </div>
          )}

          {/* Additional Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {selectedJob.attributes.type && (
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500">Job Type</span>
                <p className="font-semibold text-gray-800">{selectedJob.attributes.type}</p>
              </div>
            )}
            {selectedJob.attributes.experience && (
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500">Experience</span>
                <p className="font-semibold text-gray-800">{selectedJob.attributes.experience}</p>
              </div>
            )}
            {selectedJob.attributes.salary && (
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500">Salary</span>
                <p className="font-semibold text-gray-800">{selectedJob.attributes.salary}</p>
              </div>
            )}
            {selectedJob.attributes.deadline && (
              <div className="bg-white p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-500">Deadline</span>
                <p className="font-semibold text-gray-800">{new Date(selectedJob.attributes.deadline).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
        {/* ===== END of Job Details Section ===== */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="Addis Ababa, Ethiopia"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="+251 912 345 678"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
                <input
                  type="tel"
                  name="secondaryPhone"
                  value={formData.secondaryPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="+251 987 654 321"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Email</label>
                <input
                  type="email"
                  name="secondaryEmail"
                  value={formData.secondaryEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Professional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Profession *</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="e.g., Pharmacist"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Job Title *</label>
                <input
                  type="text"
                  name="currentJobTitle"
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="e.g., Senior Pharmacist"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                <input
                  type="number"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                >
                  <option value="">Select Industry</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="pharmaceutical">Pharmaceutical</option>
                  <option value="medical_devices">Medical Devices</option>
                  <option value="hospital">Hospital</option>
                  <option value="research">Research</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Career Level *</label>
                <select
                  name="careerLevel"
                  value={formData.careerLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                >
                  <option value="">Select Level</option>
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="manager">Manager</option>
                  <option value="director">Director</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Educational Level *</label>
                <select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                >
                  <option value="">Select Education</option>
                  <option value="high_school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study *</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="e.g., Pharmacy"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (Gross) *</label>
                <select
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                >
                  <option value="">Select Range</option>
                  <option value="0-5000">Less than 5,000 ETB</option>
                  <option value="5000-10000">5,000 - 10,000 ETB</option>
                  <option value="10000-20000">10,000 - 20,000 ETB</option>
                  <option value="20000-30000">20,000 - 30,000 ETB</option>
                  <option value="30000-50000">30,000 - 50,000 ETB</option>
                  <option value="50000+">50,000+ ETB</option>
                </select>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Languages</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you know any other language other than Amharic and English?</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="otherLanguages"
                    value="true"
                    checked={formData.otherLanguages === true}
                    onChange={handleInputChange}
                    className="mr-2"
                  /> Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="otherLanguages"
                    value="false"
                    checked={formData.otherLanguages === false}
                    onChange={handleInputChange}
                    className="mr-2"
                  /> No
                </label>
              </div>
            </div>

            {formData.otherLanguages && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">If Yes, Please Explain</label>
                <textarea
                  name="languageExplanation"
                  value={formData.languageExplanation}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFFF00] focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="List any additional languages and your proficiency level..."
                />
              </div>
            )}
          </div>

          {/* Relationship Questions */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Relationship Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have any relationship with Droga Group and affiliates suppliers, shareholders, board members, distributors?</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasRelationship"
                    value="true"
                    checked={formData.hasRelationship === true}
                    onChange={handleInputChange}
                    className="mr-2"
                  /> Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasRelationship"
                    value="false"
                    checked={formData.hasRelationship === false}
                    onChange={handleInputChange}
                    className="mr-2"
                  /> No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have any relatives that currently work at Droga Group?</label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasRelative"
                    value="true"
                    checked={formData.hasRelative === true}
                    onChange={handleInputChange}
                    className="mr-2"
                  /> Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hasRelative"
                    value="false"
                    checked={formData.hasRelative === false}
                    onChange={handleInputChange}
                    className="mr-2"
                  /> No
                </label>
              </div>
            </div>
          </div>

          {/* Documents */}
<div className="space-y-4">
  <h3 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">Documents</h3>
  
  {/* CV Upload */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Please Attach Your CV *</label>
    <div className="flex items-center gap-4">
      <input
        type="file"
        name="cv"
        id="cv-upload"
        onChange={handleInputChange}
        required
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
      <label
        htmlFor="cv-upload"
        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg border border-gray-300 transition"
      >
        Choose File
      </label>
      <span className="text-gray-600 text-sm">
        {formData.cv ? formData.cv.name : 'No file chosen'}
      </span>
    </div>
    {/* ADD THIS - Required field indicator */}
    {!formData.cv && (
      <p className="text-sm text-red-500 mt-1">* CV is required</p>
    )}
    <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
  </div>

  {/* Cover Letter Upload */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Please Attach Your Cover Letter *</label>
    <div className="flex items-center gap-4">
      <input
        type="file"
        name="coverLetter"
        id="coverLetter-upload"
        onChange={handleInputChange}
        required
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
      <label
        htmlFor="coverLetter-upload"
        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg border border-gray-300 transition"
      >
        Choose File
      </label>
      <span className="text-gray-600 text-sm">
        {formData.coverLetter ? formData.coverLetter.name : 'No file chosen'}
      </span>
    </div>
    {/* ADD THIS - Required field indicator */}
    {!formData.coverLetter && (
      <p className="text-sm text-red-500 mt-1">* Cover letter is required</p>
    )}
    <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
  </div>
</div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={formStatus === 'sending'}
              className="w-full bg-[#FFFF00] text-gray-800 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formStatus === 'sending' ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>

          {/* Success Message */}
          {formStatus === 'success' && (
            <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">Application Sent Successfully!</h3>
              <p className="text-green-700 mb-4">
                Thank you for applying. We'll review your application and get back to you soon.
              </p>
            </div>
          )}

          {/* Error Message */}
          {formStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600 font-semibold">❌ Submission failed. Please try again.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  </div>
)}

        {/* Why Join Us Section */}
        <div className="bg-gray-50 rounded-2xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Why Join Droga Pharma?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FFFF00] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Growth Opportunities</h3>
              <p className="text-gray-600">Continuous learning and career advancement in Ethiopia's leading pharmaceutical company.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FFFF00] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Great Culture</h3>
              <p className="text-gray-600">Collaborative environment where your ideas matter and contributions are valued.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#FFFF00] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Make an Impact</h3>
              <p className="text-gray-600">Help improve healthcare access and quality across Ethiopia and beyond.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-800">
                <span>How long does the hiring process take?</span>
                <span className="text-[#FFFF00] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                The typical hiring process takes 2-4 weeks from application submission to final decision. This includes initial screening, interviews, and reference checks.
              </div>
            </details>

            <details className="group bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-800">
                <span>What documents do I need to apply?</span>
                <span className="text-[#FFFF00] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                You'll need an updated CV/resume and a cover letter. Additional documents may be requested during the interview process.
              </div>
            </details>

            <details className="group bg-white rounded-lg shadow-md hover:shadow-lg transition">
              <summary className="flex justify-between items-center cursor-pointer p-6 font-semibold text-gray-800">
                <span>Can I apply for multiple positions?</span>
                <span className="text-[#FFFF00] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-600">
                Yes, you can apply for multiple positions. Please submit a separate application for each role you're interested in.
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}