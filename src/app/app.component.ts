import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  req: ApiReq;
  res: any;

  ttsForm: FormGroup;
  constructor (private fb: FormBuilder, private http: HttpClient, private sanitizer: DomSanitizer) {
    this.createForm();
  }

  createForm () {
    this.ttsForm = this.fb.group({
      apiKey: localStorage.getItem('apiKey'),
      inputText: '',
      voiceName: [],
      speed: '1.00',
      pitch: '0.00'
    });
  }

  onSubmit () {
    this.req = {
      audioConfig: {
        audioEncoding: 'LINEAR16',
        pitch: this.ttsForm.value.pitch,
        speakingRate: this.ttsForm.value.speed

      },
      input: {
        text: this.ttsForm.value.inputText
      },
      voice: {
        languageCode: 'en-US',
        name: this.ttsForm.value.voiceName
      }
    };
    localStorage.setItem('apiKey', this.ttsForm.value.apiKey);
    this.res = undefined;
    this.http.post('https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=' + this.ttsForm.value.apiKey, this.req, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .subscribe(data => {

        this.res = this.sanitizer.bypassSecurityTrustResourceUrl('data:audio/mp3;base64,' + data['audioContent']);

      });
  }
}

export interface ApiReq {

  audioConfig: {
    audioEncoding: string,
    pitch: string
    speakingRate: string

  };
  input: {
    text: string
  };
  voice: {
    languageCode: string,
    name: string
  };

}
