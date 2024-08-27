import ReactDOM from 'react-dom/client'
import Portfolio from './components/Portfolio/Portfolio'
import StarryCanvas from './components/StarryCanvas/StarryCanvas'
import Slideshow from './components/Slideshow/Slideshow'
import Timeline from './components/Timeline/Timeline'
import VerticalSectionsSlideshow from './components/VerticalSectionsSlideshow/VerticalSectionsSlideshow'
import IPortfolio from './ts/data/IPortfolio'
import ISettings from './ts/settings/ISettings'
import IGeneralSettings from './ts/settings/IGeneralSettings'
import IProjectsSlideshowSettings from './ts/settings/IProjectsSlideshowSettings'
import IStyling from './ts/settings/IStylingSettings'
import IAboutMe from './ts/data/IAboutMe'
import ISkill from './ts/data/ISkill'
import { IProject, IInternalProjectShowcase, IExternalProjectShowcase } from './ts/data/IProject'
import IContact from './ts/data/IContact'
import { IContactForm, IOpenEmailApp, IHook } from './ts/data/IContactForm'
import ISocialMedia from './ts/data/ISocialMedia'

function create(settings: ISettings | null, loadFunc: () => Promise<IPortfolio>) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <Portfolio loadFunc={loadFunc} settings={settings} />
  )
}

export {
  Portfolio,
  StarryCanvas,
  Slideshow,
  Timeline,
  VerticalSectionsSlideshow,
  create
};

export type {
  IPortfolio,
  ISettings,
  IGeneralSettings,
  IProjectsSlideshowSettings,
  IStyling,
  IAboutMe,
  ISkill,
  IProject,
  IInternalProjectShowcase,
  IExternalProjectShowcase,
  IContact,
  IContactForm,
  IOpenEmailApp,
  IHook,
  ISocialMedia
};