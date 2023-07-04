
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { elementAt, map, mergeMap, of, Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";


@Component({
  selector: 'app-product-analysis',
  templateUrl: './product-analysis.component.html',
  styleUrls: ['./product-analysis.component.scss']
})
export class ProductAnalysisComponent {
  title = "Product Analysis Tool [PAT TOOL]";
  tableHeader = [
    { code: 'CC_image', display: "Image" },
    { code: 'CC_type', display: "type" },
    { code: 'CC_type', display: "name" },
    { code: 'CC_number', display: "number" }
  ]
  counterDetails: any;
  countryLangs: any;
  search: any;
  splitted: any;
  getapi: any;
  getikeaapi: any;
  headers: HttpHeaders;
  apidata: any;

  defaultCountry: any;
  marketlocal: boolean = true;

  valueID: any;
  itemID: any;
  reasondata: any;
  tableshow: boolean = false;
  valid: boolean | undefined;
  market: any;
  myString: string = '';
  result: any[] = []
  articleid: any;
  articleresponse: any;
  ikearesponse: boolean=false;
  ikearesponse2:boolean=false;
  constructor(public translate: TranslateService, private http: HttpClient, private httpClient: HttpClientModule) {

    this.headers = new HttpHeaders({
      'DEXF-API-KEY': 'e315ad37-fd59-493e-80e3-4193dcf97e8c'
    });

  }
  ngOnInit() {
    this.country();
    this.countryLanguage();
  }
  productfrom = new FormGroup({
    serachbox: new FormControl('', [
      Validators.required,
      Validators.pattern("^[A-Za-z]{3}-\d{8}$")
    ])
  })

  countrySelected(event: any) {
    this.marketlocal = false;
    this.splitted = event.split(" ", 1);
    console.log('1', this.splitted)
    this.countryLanguage(this.marketlocal);
    setTimeout(() => {
      this.selectedData(this.splitted, this.marketlocal);
    }, 100);

  }



  selectedData(splitted: any, marketlocal: boolean) {
    let selectedCountryLangs = this.countryLangs.filter((code: any) => code.code == splitted)
    if (selectedCountryLangs.length > 0)
      this.countryLangs = selectedCountryLangs;
    else
      this.countryLanguage(marketlocal);
  }

  country() {
    this.getCountryDetails().subscribe(data => {
      this.counterDetails = data[0].Counter;
    })
  }

  countryLanguage(data?: boolean) {
    if (!data) {
      this.getCountryLangsDetails().subscribe(data => {
        this.countryLangs = data[0].countryLocalLangs;
      })
    }
  }

  getCountryDetails(): Observable<any> {
    return this.http.get('./assets/config/country.config.json').pipe(map((data: any) => {
      return data
    }));
  }

  getCountryLangsDetails(): Observable<any> {
    return this.http.get('./assets/config/countryLangs.config.json').pipe(map((data: any) => {
      return data
    }));
  }

  findarticle() {




    this.search = (document.getElementById('searchid') as HTMLInputElement).value.toLocaleUpperCase();

    this.getapi = this.http.get('https://api.dexf.ikea.com/retail/v1/query/availability/retailunit/' + this.splitted + '?filter.itemId=' + this.search, {
      headers: this.headers
    }).subscribe((data: any) => {
      console.log('getapi', data)
      this.apidata = data.data
      console.log('mssgdatastore', this.apidata)
      this.valid = data.data[0].valid
      console.log('qqq', this.valid)
      this.tableshow = true
    })

    let myString = this.splitted[0].toLowerCase();
    console.log('mystring:', myString)


    this.articleid = this.search.split("-")[1];
    console.log('art:', this.articleid)









    this.getikeaapi = this.http.get('https://www.ikea.com/' + myString + '/en/meta-data/product-lists/catalog-feed/index.json', {
    }).subscribe((data: any) => {
      console.log('getikeaapi', data)

      let resources = data.resources;
      this.result = [];
      console.log("resources1:", resources)
      for (const resource of resources) {
        if (resource.productAndGprDataRaw && resource.productAndGprDataRaw.length > 0) {
          this.result = this.result.concat(resource.productAndGprDataRaw)
        }
      }
      console.log("result:", this.result)
      this.articleresponse = this.result.filter(el => el.id === this.articleid)
      console.log('qqqq:', this.articleresponse)
      if(this.articleresponse.length>0)
      {

        this.ikearesponse = true;
        this.ikearesponse2=false;
        
        console.log('res:', "true")
      }
      else 
      {
        this.ikearesponse2 =true;
        this.ikearesponse=false;
      }
      // this.ikearesponse = this.articleresponse
      // console.log('rtttt:', this.articleresponse)



      
    })

  }




}