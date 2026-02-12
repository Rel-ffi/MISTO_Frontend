import './App.css'
import {Route, Routes} from "react-router-dom";
import {RegisterPage} from "./components/RegisterPage/RegisterPage.tsx";
import {LoginPage} from "./components/LoginPage/LoginPage.tsx";
import {OtpPage} from "./components/OtpPage/OtpPage.tsx";
import {OAuthSuccessPage} from "./components/OAuthSuccessPage/OAuthSuccessPage.tsx";
import {AgePage} from "./components/AgePage/AgePage.tsx";
import {AgeGuard} from "./components/AgeGuard/AgeGuard.tsx";
import {AuthLayout} from "./components/AuthLayout/AuthLayout.tsx";
import {FeaturePage} from "./components/FeaturePage/FeaturePage.tsx";
import {HeaderComponent} from "./components/Header/HeaderComponent.tsx";
import {MainLayout} from "./components/MainLayout/MainLayout.tsx";
import {MainPage} from "./components/MainPage/MainPage.tsx";
import {UserProfileLayout} from "./components/UserProfileLayout/UserProfileLayout.tsx";
import {UserProfilePage} from "./components/UserProfileLayout/UserProfilePage/UserProfilePage.tsx";
import {UserFavoritesPage} from "./components/UserProfileLayout/UserFavoritesPage/UserFavoritesPage.tsx";
import {UserPlacesPage} from "./components/UserProfileLayout/UserPlacesPage/UserPlacesPage.tsx";
import {
    EstablishmentListSmallComponent
} from "./components/UserProfileLayout/UserPlacesPage/EstablishmentListSmallComponent/EstablishmentListSmallComponent.tsx";
import EstablishmentDetailsComponent from "./components/EstablishmentDetails/EstablishmentDetailsComponent.tsx";
import {AdminPage} from "./components/AdminPage/AdminPage.tsx";
import {PulsePage} from "./components/PulsePage/PulsePage.tsx";
import {EstablishmentsSearchPage} from "./components/EstablihshmentsPage/EstablishmentsSearchPage.tsx";
import UserReviewsPage from "./components/UserProfileLayout/UserReviewsPage/UserReviewsPage.tsx";
import {NotImplemented} from "./components/NotImplemented/NotImplemented.tsx";


function App() {
  return (
      <Routes>
          <Route element={<MainLayout/>}>
              <Route path="/features" element={<AgeGuard><FeaturePage/></AgeGuard>}/>
              <Route path="/header" element={<HeaderComponent/>}/>
              <Route path="/establishment/:id" element={<AgeGuard><EstablishmentDetailsComponent/></AgeGuard>}/>
              <Route path="/" element={<AgeGuard><MainPage/></AgeGuard>}/>
              <Route  path="/settings" element={<AgeGuard><UserProfileLayout/></AgeGuard>}>
                  <Route path="profile" element={<AgeGuard><UserProfilePage/></AgeGuard>}/>
                  <Route path="favorites" element={<AgeGuard><UserFavoritesPage/></AgeGuard>}/>
                  <Route path="reviews" element={<AgeGuard><UserReviewsPage/></AgeGuard>}/>
                  <Route path="places" element={<AgeGuard><UserPlacesPage/></AgeGuard>}>
                      <Route path="establishment" element={<AgeGuard><EstablishmentListSmallComponent/></AgeGuard>}/>
                  </Route>
              </Route>
              <Route path="/adminpage" element={<AgeGuard><AdminPage/></AgeGuard>}/>
              <Route path="/pulse" element={<AgeGuard><PulsePage/></AgeGuard>}/>
              <Route path="/smart-search" element={<AgeGuard><EstablishmentsSearchPage/></AgeGuard>}/>


              <Route path="/direct/*" element={<NotImplemented type="notImplemented"/>}/>
              <Route path="/business" element={<NotImplemented type="notImplemented"/>}/>
              <Route path="/facebook" element={<NotImplemented type="notImplemented"/>}/>
              <Route path="/privacy" element={<NotImplemented type="notImplemented"/>}/>
              <Route path="/terms" element={<NotImplemented type="notImplemented"/>}/>
              <Route path="/support" element={<NotImplemented type="notImplemented"/>}/>
              <Route path="*" element={<NotImplemented type="404"/>}/>

          </Route>
          <Route path="/agePage" element={<AgePage />} />

          <Route path="/auth" element={<AgeGuard><AuthLayout /></AgeGuard>}>
              <Route path="login" element={<AgeGuard><LoginPage /></AgeGuard>} />
              <Route path="register" element={<AgeGuard><RegisterPage /></AgeGuard>} />
              <Route path="verify-otp" element={<OtpPage />} />
              <Route path="oauth2/success" element={<OAuthSuccessPage />} />
          </Route>
      </Routes>
  )
}

export default App
