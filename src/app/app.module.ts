import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AsyncDatabase, IndexedDB } from '@ezzabuzaid/document-storage';
import { AsyncCollection } from '@ezzabuzaid/document-storage/async/async.collection';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export class HttpCacheEntry {
  constructor(
      public id: number,
      public url: string,
      public value: any
  ) { }
}

const db = new AsyncDatabase(new IndexedDB('cache'))
const collection = db.collection('CACHE') as unknown as AsyncCollection<HttpCacheEntry>;

export const fetchCached = async (resource: RequestInfo, config = { method: 'GET' }) => {
  console.log(resource, config);
  const url = typeof resource === 'string' ? resource : resource.url;
  const requestString = (config.method ?? 'GET') + url

  const cached = await collection.get((entry) => entry.url === requestString);

  if(cached) {
    return cached.value;
  }

  const response = await (await fetch(resource, config)).json();
  const entry = new HttpCacheEntry(1, requestString, response);
  await collection.set(entry);

  return response;
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
