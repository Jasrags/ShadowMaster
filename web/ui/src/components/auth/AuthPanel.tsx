import { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-aria-components';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export function AuthPanel() {
  const [selectedTab, setSelectedTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-sr-darker p-4">
      <div className="w-full max-w-md">
        <div className="bg-sr-gray border border-sr-light-gray rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-2 text-sr-accent">
            ShadowMaster
          </h1>
          <p className="text-center text-gray-400 mb-6">RPG System</p>

          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as 'login' | 'register')}
            className="w-full"
          >
            <TabList className="flex gap-2 mb-6 border-b border-sr-light-gray">
              <Tab
                id="login"
                className="px-4 py-2 text-sm font-medium text-gray-400 border-b-2 border-transparent data-[selected]:text-sr-accent data-[selected]:border-sr-accent cursor-pointer transition-colors"
              >
                Login
              </Tab>
              <Tab
                id="register"
                className="px-4 py-2 text-sm font-medium text-gray-400 border-b-2 border-transparent data-[selected]:text-sr-accent data-[selected]:border-sr-accent cursor-pointer transition-colors"
              >
                Register
              </Tab>
            </TabList>

            <TabPanel id="login">
              <LoginForm />
            </TabPanel>

            <TabPanel id="register">
              <RegisterForm />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

