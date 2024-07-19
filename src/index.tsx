import ReactDOM from 'react-dom/client'
import Portfolio from './Portfolio'
import StarryCanvas from './components/StarryCanvas/StarryCanvas'
import Slideshow from './components/Slideshow/Slideshow'
import Timeline from './components/Timeline/Timeline'
import VerticalSectionsSlideshow from './components/VerticalSectionsSlideshow/VerticalSectionsSlideshow'
import IPortfolio from './ts/IPortfolio'
import IStyling from './ts/IStyling'
import IAboutMe from './ts/IAboutMe'
import ISkill from './ts/ISkill'
import { IProject, IInternalProjectShowcase, IExternalProjectShowcase } from './ts/IProject'
import IContact from './ts/IContact'
import { IContactForm, IOpenEmailApp, IHook } from './ts/IContactForm'
import ISocialMedia from './ts/ISocialMedia'

function create(styling: IStyling | null, loadFunc: () => Promise<IPortfolio>) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <Portfolio loadFunc={loadFunc} styling={styling} />
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