import React from "react";

export interface IProject {
    showcase: IProjectShowcase;
}

interface IProjectShowcase {
    title: string;
    backgroundColor: string;
}

export interface IInternalProjectShowcase extends IProjectShowcase {
    component: React.JSX.Element
}

export interface IExternalProjectShowcase extends IProjectShowcase {
    url: string;
}