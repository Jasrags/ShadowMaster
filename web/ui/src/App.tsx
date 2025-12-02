import { I18nProvider } from 'react-aria-components';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthenticatedRoute } from './components/layout/AuthenticatedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { HomePage } from './pages/HomePage';
import { CampaignsPage } from './pages/CampaignsPage';
import { CharactersPage } from './pages/CharactersPage';
import { CharacterCreationPage } from './pages/CharacterCreationPage';
import { CharacterSheetPage } from './pages/CharacterSheetPage';
import { GearPage } from './pages/GearPage';
import { ArmorPage } from './pages/ArmorPage';
import { WeaponsPage } from './pages/WeaponsPage';
import { WeaponAccessoriesPage } from './pages/WeaponAccessoriesPage';
import { SkillsPage } from './pages/SkillsPage';
import { QualitiesPage } from './pages/QualitiesPage';
import { BooksPage } from './pages/BooksPage';
import { LifestylesPage } from './pages/LifestylesPage';
import { WeaponConsumablesPage } from './pages/WeaponConsumablesPage';
import { ContactsPage } from './pages/ContactsPage';
import { ActionsPage } from './pages/ActionsPage';
import { CyberwarePage } from './pages/CyberwarePage';
import { BiowarePage } from './pages/BiowarePage';
import { ComplexFormsPage } from './pages/ComplexFormsPage';
import { MentorsPage } from './pages/MentorsPage';
import { MetatypesPage } from './pages/MetatypesPage';
import { PowersPage } from './pages/PowersPage';
import { ProgramsPage } from './pages/ProgramsPage';
import { SpellsPage } from './pages/SpellsPage';
import { TraditionsPage } from './pages/TraditionsPage';
import { VehicleModificationsPage } from './pages/VehicleModificationsPage';
import { VehiclesPage } from './pages/VehiclesPage';

function App() {
  return (
    <I18nProvider locale="en-US">
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Public route */}
                <Route path="/" element={<HomePage />} />
                {/* Protected routes */}
                <Route
                  path="/campaigns"
                  element={
                    <AuthenticatedRoute>
                      <CampaignsPage />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/characters/create"
                  element={
                    <AuthenticatedRoute>
                      <CharacterCreationPage />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="/campaigns/:campaignId/characters/create"
                  element={
                    <AuthenticatedRoute>
                      <CharacterCreationPage />
                    </AuthenticatedRoute>
                  }
                />
                {/* Admin-only routes - Characters */}
                <Route
                  path="/characters"
                  element={
                    <AdminRoute>
                      <CharactersPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/characters/:id"
                  element={
                    <AdminRoute>
                      <CharacterSheetPage />
                    </AdminRoute>
                  }
                />
                {/* Admin-only routes - Database tab redirects to Gear (first nested tab) */}
                <Route
                  path="/database"
                  element={
                    <AdminRoute>
                      <Navigate to="/gear" replace />
                    </AdminRoute>
                  }
                />
                {/* Admin-only routes - Gear, Armor, Weapons, Skills, and Qualities (shown under Database tab) */}
                <Route
                  path="/gear"
                  element={
                    <AdminRoute>
                      <GearPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/armor"
                  element={
                    <AdminRoute>
                      <ArmorPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/weapons"
                  element={
                    <AdminRoute>
                      <WeaponsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/weapon-accessories"
                  element={
                    <AdminRoute>
                      <WeaponAccessoriesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/skills"
                  element={
                    <AdminRoute>
                      <SkillsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/qualities"
                  element={
                    <AdminRoute>
                      <QualitiesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/books"
                  element={
                    <AdminRoute>
                      <BooksPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/lifestyles"
                  element={
                    <AdminRoute>
                      <LifestylesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/weapon-consumables"
                  element={
                    <AdminRoute>
                      <WeaponConsumablesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/contacts"
                  element={
                    <AdminRoute>
                      <ContactsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/actions"
                  element={
                    <AdminRoute>
                      <ActionsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/cyberware"
                  element={
                    <AdminRoute>
                      <CyberwarePage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/bioware"
                  element={
                    <AdminRoute>
                      <BiowarePage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/complex-forms"
                  element={
                    <AdminRoute>
                      <ComplexFormsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/mentors"
                  element={
                    <AdminRoute>
                      <MentorsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/metatypes"
                  element={
                    <AdminRoute>
                      <MetatypesPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/powers"
                  element={
                    <AdminRoute>
                      <PowersPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/programs"
                  element={
                    <AdminRoute>
                      <ProgramsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/spells"
                  element={
                    <AdminRoute>
                      <SpellsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/traditions"
                  element={
                    <AdminRoute>
                      <TraditionsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/vehicle-modifications"
                  element={
                    <AdminRoute>
                      <VehicleModificationsPage />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/vehicles"
                  element={
                    <AdminRoute>
                      <VehiclesPage />
                    </AdminRoute>
                  }
                />
                {/* Add more protected routes here as needed */}
                {/* <Route
                  path="/characters"
                  element={
                    <AuthenticatedRoute>
                      <CharactersPage />
                    </AuthenticatedRoute>
                  }
                /> */}
                {/* <Route
                  path="/sessions"
                  element={
                    <AuthenticatedRoute>
                      <SessionsPage />
                    </AuthenticatedRoute>
                  }
                /> */}
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </I18nProvider>
  );
}

export default App;
