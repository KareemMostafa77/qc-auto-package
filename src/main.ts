import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initQcAutoGlobal } from '../projects/ng-qcauto/src/public-api';

bootstrapApplication(App, appConfig)
  .then(() => {
    // Initialize ng-qcauto for demonstration
    initQcAutoGlobal();
  })
  .catch((err) => console.error(err));
