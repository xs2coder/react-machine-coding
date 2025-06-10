import React, { useState } from 'react';

const Tabs = ({ children, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg">
        {React.Children.map(children, (child, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 font-medium text-sm transition-all duration-200 relative ${
              activeTab === index
                ? 'text-blue-600 bg-white border-b-2 border-blue-600 -mb-px'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {child.props.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0">
        <div className="p-6">
          {React.Children.toArray(children)[activeTab]}
        </div>
      </div>
    </div>
  );
};

const TabPanel = ({ children, label }) => {
  return <div>{children}</div>;
};

// Example usage with demo content
const TabsDemo = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          React Tabs Component
        </h1>
        
        <Tabs defaultTab={0}>
          <TabPanel label="Dashboard">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to your dashboard! Here you can view key metrics, recent activity, 
                and important updates at a glance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800">Total Users</h3>
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-800">Revenue</h3>
                  <p className="text-2xl font-bold text-green-600">$12,345</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-medium text-purple-800">Orders</h3>
                  <p className="text-2xl font-bold text-purple-600">567</p>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel label="Profile">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-gray-800">John Doe</h3>
                    <p className="text-gray-600">john.doe@example.com</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input 
                      type="text" 
                      value="John" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      value="Doe" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel label="Settings">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-800">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive email updates about your account</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                    Enabled
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors">
                    Disabled
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-800">Dark Mode</h3>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors">
                    Off
                  </button>
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel label="Help">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Help & Support</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800">How do I reset my password?</h4>
                      <p className="text-gray-600 mt-1">Click on the "Forgot Password" link on the login page and follow the instructions.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800">How do I update my profile?</h4>
                      <p className="text-gray-600 mt-1">Go to the Profile tab and click the edit button to modify your information.</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800">Need more help?</h4>
                      <p className="text-gray-600 mt-1">Contact our support team at support@example.com or call 1-800-HELP-ME.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default TabsDemo;