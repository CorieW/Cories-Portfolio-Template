import IAboutMe from "./IAboutMe";
import IContact from "./IContact";
import { IContactForm } from "./IContactForm";
import { IProject } from "./IProject";
import ISkill from "./ISkill";
import ISocialMedia from "./ISocialMedia";

export default interface IPortfolio {
    name: string | null,
    logo: string | null,
    aboutMe: IAboutMe,
    skills: ISkill[],
    projects: IProject[],
    contacts: IContact[],
    socials: ISocialMedia[],
    contactForm: IContactForm | null
}