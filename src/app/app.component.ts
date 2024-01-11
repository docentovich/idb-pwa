import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { fetchCached } from './app.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular16';
  data = {};

  constructor(private http: HttpClient) {
  }

  public ngOnInit(): void {
    // fetch('https://jsonplaceholder.typicode.com/todos/1')
    //     .then(response => response.json())
    //     .then(json => console.log(json))
    // this.http.get(`https://jsonplaceholder.typicode.com/todos/1`)
    //     .subscribe(data => {
    //       this.data = data
    //     })

    fetchCached(
        'https://jsonplaceholder.typicode.com/posts',
        { method: 'POST',
          body: JSON.stringify({
            title: 'foo',
            body: 'bar',
            userId: 1,
          })
        })
        .then((data) => this.data = data)
  }


}
