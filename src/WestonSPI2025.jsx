import React, { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const LOGO = "data:image/png;base64,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";

const RAW = {"quarters":["2025-Q1","2025-Q2","2025-Q3","2025-Q4"],"summary":{"2025-Q1":{"total":11,"ans":10,"adr":1,"misc":1,"AI":4,"Dev":3,"Comms":3,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"2025-Q2":{"total":20,"ans":13,"adr":7,"misc":2,"AI":5,"Dev":5,"Comms":1,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":1,"BIRD_WL":1,"FOD_ADR":1,"GI_ADR":4},"2025-Q3":{"total":14,"ans":9,"adr":5,"misc":0,"AI":1,"Dev":4,"Comms":2,"Re_ANS":1,"UAD":1,"RI_ADR":0,"RE_ADR":1,"BIRD_WL":1,"FOD_ADR":1,"GI_ADR":2},"2025-Q4":{"total":7,"ans":5,"adr":2,"misc":1,"AI":2,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":1,"RI_ADR":1,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":1}},"records":[{"headline":"Unauthorised Drone in Weston AOR","spi_code":"UAD","department":"ANS","month":"Dec 2025","quarter":"2025-Q4","year":"2025","report_number":"OR-0000000001281594","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":1,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Unauthorised SUA","spi_code":"UAD","department":"ANS","month":"Jul 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001042103","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":1,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Military Airspace Incursion","spi_code":"AI","department":"ANS","month":"Dec 2025","quarter":"2025-Q4","year":"2025","report_number":"OR-0000000001266956","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Airspace infringement","spi_code":"AI","department":"ANS","month":"Oct 2025","quarter":"2025-Q4","year":"2025","report_number":"OR-0000000001192580","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Incursion into Dublin CTR","spi_code":"AI","department":"ANS","month":"Sep 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001143487","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Airspace  infringement","spi_code":"AI","department":"ANS","month":"Jun 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000995648","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Airspace infringement","spi_code":"AI","department":"ANS","month":"May 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000941336","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Airspace Incursion","spi_code":"AI","department":"ANS","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000906490","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"R15 Airspace incursion","spi_code":"AI","department":"ANS","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000903082","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Airspace Incursion to the North","spi_code":"AI","department":"ANS","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000898716","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Airspace Incursion to the North","spi_code":"AI","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000898712","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"R15 Airspace Incursion","spi_code":"AI","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000877101","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Airspace Infringement","spi_code":"AI","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000876755","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"airspace infringement","spi_code":"AI","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000873128","spis":{"AI":1,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Aircraft moved from parking position during high winds","spi_code":"GI_ADR","department":"ADR","month":"Dec 2025","quarter":"2025-Q4","year":"2025","report_number":"OR-0000000001263362","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":1},"is_misc":false},{"headline":"Aircraft struck pole on apron when turning to park","spi_code":"GI_ADR","department":"ADR","month":"Sep 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001171615","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":1},"is_misc":false},{"headline":"Deviation from procedure - fuelling","spi_code":"GI_ADR","department":"ADR","month":"Aug 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001121339","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":1},"is_misc":false},{"headline":"Panel missing from aircraft after flight","spi_code":"GI_ADR","department":"ADR","month":"Jun 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000001023333","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":1},"is_misc":false},{"headline":"contact between aircraft in hangar","spi_code":"GI_ADR","department":"ADR","month":"Jun 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000001004043","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":1},"is_misc":false},{"headline":"Aircraft winglet struck pole on apron","spi_code":"GI_ADR","department":"ADR","month":"May 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000940658","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":1},"is_misc":false},{"headline":"Flat Tyre on Runway after landing","spi_code":"GI_ADR","department":"ADR","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000904553","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":1},"is_misc":false},{"headline":"Runway incursion","year":"2025","report_number":"OR-0000000001241148","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":true},{"headline":"R3 Runway Incursion","spi_code":"RI_ANS","department":"ANS","month":"Nov 2025","quarter":"2025-Q4","year":"2025","report_number":"OR-0000000001241114","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":1,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC instruction","spi_code":"Dev","department":"ANS","month":"Oct 2025","quarter":"2025-Q4","year":"2025","report_number":"OR-0000000001185347","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation for ATC clearance","spi_code":"Dev","department":"ANS","month":"Aug 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001099061","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC clearance","spi_code":"Dev","department":"ANS","month":"Jul 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001059268","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC clearance","spi_code":"Dev","department":"ANS","month":"Jul 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001042672","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC Clearance","spi_code":"Dev","department":"ANS","month":"Jul 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001041672","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC clearance","spi_code":"Dev","department":"ANS","month":"Jun 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000001005901","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC instruction","spi_code":"Dev","department":"ANS","month":"May 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000941274","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"N840CD landing without clearance","spi_code":"Dev","department":"ANS","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000933180","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Backtrack without Clearance","spi_code":"Dev","department":"ANS","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000925251","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Landing without clearance","spi_code":"Dev","department":"ANS","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000900611","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC clearance","spi_code":"Dev","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000876183","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC Clearance","spi_code":"Dev","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000872386","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Deviation from ATC Clearance","spi_code":"Dev","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000872230","spis":{"AI":0,"Dev":1,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Wildlife (deer) on aerodrome","spi_code":"BIRD_WL","department":"ADR","month":"Sep 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001165046","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":1,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Bird Strike EI-HLF","spi_code":"BIRD_WL","department":"ADR","month":"Jun 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000992887","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":1,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Flat tire on the RWY","spi_code":"GI_ANS","department":"ANS","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000903160","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":true},{"headline":"Malfunction of electric system on board","spi_code":"Comms","department":"ANS","month":"Sep 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001160304","spis":{"AI":0,"Dev":0,"Comms":1,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Aircraft Radio Failure","spi_code":"Comms","department":"ANS","month":"Jul 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001026593","spis":{"AI":0,"Dev":0,"Comms":1,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Phone line Problem with Dublin ATS","spi_code":"Comms","department":"ANS","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000900601","spis":{"AI":0,"Dev":0,"Comms":1,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Comms and Transponder Failure","spi_code":"Comms","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000884577","spis":{"AI":0,"Dev":0,"Comms":1,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Aircraft Failure of Communication","spi_code":"Comms","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000883589","spis":{"AI":0,"Dev":0,"Comms":1,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Aircraft Failure of Communication","spi_code":"Comms","department":"ANS","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000875174","spis":{"AI":0,"Dev":0,"Comms":1,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Object found on runway 25","spi_code":"FOD_ADR","department":"ADR","month":"Aug 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001117457","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":1,"GI_ADR":0},"is_misc":false},{"headline":"FOD on Runway 25","spi_code":"FOD_ADR","department":"ADR","month":"Jun 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000001003096","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":1,"GI_ADR":0},"is_misc":false},{"headline":"Runway Excursion","spi_code":"RE_ADR","department":"ADR","month":"Jul 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001028500","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":1,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Runway Incursion - Aircraft landed without  clearance","spi_code":"RE_ADR","department":"ADR","month":"Apr 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000000949231","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":1,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"Runway Excursion","spi_code":"RE_ANS","department":"ANS","month":"Jul 2025","quarter":"2025-Q3","year":"2025","report_number":"OR-0000000001025069","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":1,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":false},{"headline":"ATCO Unit Endorsement Expiration","spi_code":"ATCO","department":"ANS","month":"Jun 2025","quarter":"2025-Q2","year":"2025","report_number":"OR-0000000001018554","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":true},{"headline":"Deviation from ATC clearance","spi_code":"DEV_ADR","department":"ADR","month":"Mar 2025","quarter":"2025-Q1","year":"2025","report_number":"OR-0000000000878540","spis":{"AI":0,"Dev":0,"Comms":0,"Re_ANS":0,"UAD":0,"RI_ADR":0,"RE_ADR":0,"BIRD_WL":0,"FOD_ADR":0,"GI_ADR":0},"is_misc":true}],"spi_labels":{"AI":"Airspace Infringements","Dev":"Deviation from ATC Clearance","Comms":"Comms Failure","Re_ANS":"Runway Excursions (ANS)","UAD":"Unauthorised Drone/SUA","RI_ADR":"Runway Incursions (ADR)","RE_ADR":"Runway Excursions (ADR)","BIRD_WL":"Bird/Wildlife Activity","FOD_ADR":"FOD","GI_ADR":"Ground Incidents (ADR)"},"ans_spis":["AI","Dev","Comms","Re_ANS","UAD"],"adr_spis":["RI_ADR","RE_ADR","BIRD_WL","FOD_ADR","GI_ADR"]};

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR89qaWNwl44T5AZRXejQIWN4DuMxNByQ0CgDg28IXGHY4DeLMPbU_dAx2h9z0rh4z0Pt7nyH6WHXqh/pub?gid=1446631849&single=true&output=csv";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const SPI_CODE_TO_SPIS = {
  AI:      {AI:1,Dev:0,Comms:0,Re_ANS:0,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  Dev:     {AI:0,Dev:1,Comms:0,Re_ANS:0,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  Comms:   {AI:0,Dev:0,Comms:1,Re_ANS:0,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  Re_ANS:  {AI:0,Dev:0,Comms:0,Re_ANS:1,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  RE_ANS:  {AI:0,Dev:0,Comms:0,Re_ANS:1,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  UAD:     {AI:0,Dev:0,Comms:0,Re_ANS:0,UAD:1,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  RI_ADR:  {AI:0,Dev:0,Comms:0,Re_ANS:0,UAD:0,RI_ADR:1,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  RI_ANS:  {AI:0,Dev:0,Comms:0,Re_ANS:0,UAD:0,RI_ADR:1,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  RE_ADR:  {AI:0,Dev:0,Comms:0,Re_ANS:0,UAD:0,RI_ADR:0,RE_ADR:1,BIRD_WL:0,FOD_ADR:0,GI_ADR:0},
  BIRD_WL: {AI:0,Dev:0,Comms:0,Re_ANS:0,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:1,FOD_ADR:0,GI_ADR:0},
  FOD_ADR: {AI:0,Dev:0,Comms:0,Re_ANS:0,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:1,GI_ADR:0},
  GI_ADR:  {AI:0,Dev:0,Comms:0,Re_ANS:0,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:1},
};
const ZERO_SPIS = {AI:0,Dev:0,Comms:0,Re_ANS:0,UAD:0,RI_ADR:0,RE_ADR:0,BIRD_WL:0,FOD_ADR:0,GI_ADR:0};

function parseSheetCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return null;

  // Parse a CSV line respecting quoted fields
  const parseLine = (line) => {
    const cols = []; let cur = ""; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQ = !inQ; }
      else if (c === ',' && !inQ) { cols.push(cur.trim()); cur = ""; }
      else { cur += c; }
    }
    cols.push(cur.trim());
    return cols;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/"/g, ""));
  const find = (...kws) => { for (const kw of kws) { const i = headers.findIndex(h => h.includes(kw)); if (i !== -1) return i; } return -1; };

  const H   = find("headline");
  const SPI = find("spi code", "spi_code");
  const DEP = find("department");
  const DAT = find("utc date", "utc_date", "initial date", "date");
  const RNO = find("report ident", "report_number", "report number");

  const parseDate = (str) => {
    if (!str) return null;
    // Try DD/MM/YYYY
    const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dmy) return new Date(+dmy[3], +dmy[2] - 1, +dmy[1]);
    // Try YYYY-MM-DD
    const ymd = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (ymd) return new Date(+ymd[1], +ymd[2] - 1, +ymd[3]);
    return null;
  };

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    const headline = H !== -1 ? row[H] || "" : "";
    if (!headline) continue;

    const spiCode = (SPI !== -1 ? row[SPI] : "") || "";
    const dept    = (DEP !== -1 ? row[DEP] : "") || "";
    const dateStr = (DAT !== -1 ? row[DAT] : "") || "";
    const repNum  = (RNO !== -1 ? row[RNO] : "") || "";

    const d = parseDate(dateStr);
    const month   = d ? `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}` : "";
    const quarter = d ? `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}` : "";
    const year    = d ? `${d.getFullYear()}` : "";

    const spis    = SPI_CODE_TO_SPIS[spiCode] || ZERO_SPIS;
    const is_misc = !SPI_CODE_TO_SPIS[spiCode];

    records.push({ headline, spi_code: spiCode, department: dept, month, quarter, year, report_number: repNum, spis, is_misc });
  }

  // Derive quarters and compute summary
  const quartersSet = new Set(records.filter(r => r.quarter).map(r => r.quarter));
  const quarters = Array.from(quartersSet).sort();
  const SPI_KEYS = ["AI","Dev","Comms","Re_ANS","UAD","RI_ADR","RE_ADR","BIRD_WL","FOD_ADR","GI_ADR"];

  const summary = {};
  for (const q of quarters) {
    const all  = records.filter(r => r.quarter === q);
    const main = all.filter(r => !r.is_misc);
    const s = { total: main.length, ans: main.filter(r => r.department === "ANS").length, adr: main.filter(r => r.department === "ADR").length, misc: all.filter(r => r.is_misc).length };
    for (const k of SPI_KEYS) s[k] = main.reduce((acc, r) => acc + (r.spis[k] || 0), 0);
    summary[q] = s;
  }

  return { quarters, summary, records, spi_labels: SPI_LABELS, ans_spis: ANS_SPIS, adr_spis: ADR_SPIS };
}

const ANS_COLOR = "#0ea5e9";
const ADR_COLOR = "#f97316";
const ANS_SPIS = ["AI","Dev","Comms","Re_ANS","UAD"];
const ADR_SPIS = ["RI_ADR","RE_ADR","BIRD_WL","FOD_ADR","GI_ADR"];
const SPI_LABELS = {"AI":"Airspace Infringements","Dev":"Deviation from ATC Clearance","Comms":"Comms Failure","Re_ANS":"Runway Excursions (ANS)","UAD":"Unauthorised Drone/SUA","RI_ADR":"Runway Incursions (ADR)","RE_ADR":"Runway Excursions (ADR)","BIRD_WL":"Bird/Wildlife Activity","FOD_ADR":"FOD","GI_ADR":"Ground Incidents (ADR)"};

const ANS_SPI_COLORS = ["#0ea5e9","#38bdf8","#7dd3fc","#0284c7","#075985"];
const ADR_SPI_COLORS = ["#f97316","#fb923c","#fdba74","#ea580c","#c2410c"];

export default function App() {
  const [quarterFilter, setQuarterFilter] = useState("All");
  const [unitFilter, setUnitFilter] = useState("Both");
  const [modal, setModal] = useState(null);
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    fetch(SHEET_URL)
      .then(r => r.text())
      .then(csv => { const parsed = parseSheetCSV(csv); if (parsed) setLiveData(parsed); })
      .catch(() => {});
  }, []);

  const data = liveData || RAW;

  const quarters2025 = data.quarters.filter(q => q.startsWith("2025"));
  const filterOptions = ["All", ...quarters2025];

  const filteredRecords = useMemo(() => {
    return data.records.filter(r => {
      const qMatch = quarterFilter === "All" || r.quarter === quarterFilter;
      const uMatch = unitFilter === "Both" || r.department === unitFilter;
      return qMatch && uMatch;
    });
  }, [data, quarterFilter, unitFilter]);

  const activeQuarters = useMemo(() => {
    if (quarterFilter !== "All") return [quarterFilter];
    return data.quarters;
  }, [quarterFilter, data]);

  const barData = useMemo(() => activeQuarters.map(q => ({
    quarter: q,
    ANS: data.summary[q]?.ans || 0,
    ADR: data.summary[q]?.adr || 0,
    Misc: data.summary[q]?.misc || 0,
  })), [activeQuarters, data]);

  const ansLineData = useMemo(() => activeQuarters.map(q => {
    const s = data.summary[q] || {};
    const obj = { quarter: q };
    ANS_SPIS.forEach(k => obj[k] = s[k] || 0);
    return obj;
  }), [activeQuarters, data]);

  const adrLineData = useMemo(() => activeQuarters.map(q => {
    const s = data.summary[q] || {};
    const obj = { quarter: q };
    ADR_SPIS.forEach(k => obj[k] = s[k] || 0);
    return obj;
  }), [activeQuarters, data]);

  const totals = useMemo(() => ({
    total: filteredRecords.length,
    ans: filteredRecords.filter(r => r.department === "ANS").length,
    adr: filteredRecords.filter(r => r.department === "ADR").length,
    misc: filteredRecords.filter(r => r.is_misc).length,
    ansSpi: filteredRecords.filter(r => r.department === "ANS" && !r.is_misc).length,
    adrSpi: filteredRecords.filter(r => r.department === "ADR" && !r.is_misc).length,
  }), [filteredRecords]);

  const spiBarData = useMemo(() => {
    const all = [...ANS_SPIS, ...ADR_SPIS];
    return all.map(k => ({
      name: SPI_LABELS[k],
      code: k,
      count: activeQuarters.reduce((s, q) => s + (data.summary[q]?.[k] || 0), 0),
      unit: ANS_SPIS.includes(k) ? "ANS" : "ADR",
    })).filter(d => d.count > 0).sort((a,b) => b.count - a.count);
  }, [activeQuarters, data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:8,padding:"10px 14px",boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}>
        <div style={{fontWeight:700,color:"#1e3a5f",marginBottom:6,fontSize:13}}>{label}</div>
        {payload.map(p => <div key={p.name} style={{fontSize:12,color:p.color,marginBottom:2}}>{p.name}: <strong>{p.value}</strong></div>)}
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:"#f0f6ff",fontFamily:"'DM Sans', 'Segoe UI', sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .kpi-card { background: #fff; border-radius: 16px; padding: 20px 24px; border: 1.5px solid #e2eeff; transition: transform 0.15s, box-shadow 0.15s; }
        .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(14,82,163,0.1); }
        .filter-btn { border: 1.5px solid #c7deff; background: #fff; border-radius: 8px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #1e3a5f; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .filter-btn:hover { background: #e8f1ff; }
        .filter-btn.active { background: #1e3a5f; color: #fff; border-color: #1e3a5f; }
        .chart-card { background: #fff; border-radius: 16px; padding: 20px 24px; border: 1.5px solid #e2eeff; }
        .spi-row { display: flex; align-items: center; padding: 10px 14px; border-radius: 8px; cursor: pointer; transition: background 0.12s; margin-bottom: 4px; }
        .spi-row:hover { background: #f0f6ff; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(10,30,80,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #fff; border-radius: 16px; padding: 28px 32px; width: 560px; max-height: 80vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .rec-tag { display: inline-flex; align-items: center; background: #f0f6ff; border: 1px solid #c7deff; border-radius: 6px; padding: 4px 10px; font-size: 11px; color: #1e3a5f; margin: 3px; font-weight: 500; }
      `}</style>

      {/* HEADER */}
      <div style={{background:"#1e3a5f",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:70}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <img src={LOGO} alt="Weston Airport" style={{height:48,borderRadius:6}} />
          <div>
            <div style={{color:"#fff",fontSize:17,fontWeight:700,letterSpacing:0.5}}>Safety Performance Indicators</div>
            <div style={{color:"#7eb8e8",fontSize:11,letterSpacing:1.5,textTransform:"uppercase"}}>Weston Airport · ECCAIRS2 Dashboard</div>
          </div>
        </div>
        <div style={{color:"#7eb8e8",fontSize:11,letterSpacing:1}}>Data: 2025</div>
      </div>

      <div style={{padding:"24px 32px"}}>

        {/* FILTERS */}
        <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{fontSize:11,color:"#5a7fa8",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginRight:4}}>Quarter</span>
          {filterOptions.map(q => (
            <button key={q} className={`filter-btn ${quarterFilter===q?"active":""}`} onClick={() => setQuarterFilter(q)}>{q}</button>
          ))}
          <div style={{width:1,height:24,background:"#c7deff",margin:"0 8px"}} />
          <span style={{fontSize:11,color:"#5a7fa8",fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginRight:4}}>Unit</span>
          {["Both","ANS","ADR"].map(u => (
            <button key={u} className={`filter-btn ${unitFilter===u?"active":""}`} onClick={() => setUnitFilter(u)}>{u}</button>
          ))}
        </div>

        {/* KPI CARDS */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:24}}>
          {[
            {label:"Total Occurrences",val:totals.total,color:"#1e3a5f",bg:"#e8f1ff"},
            {label:"ANS Occurrences",val:totals.ans,color:"#0369a1",bg:"#e0f2fe"},
            {label:"ADR Occurrences",val:totals.adr,color:"#c2410c",bg:"#fff7ed"},
            {label:"ANS SPIs",val:totals.ansSpi,color:"#0ea5e9",bg:"#f0f9ff"},
            {label:"ADR SPIs",val:totals.adrSpi,color:"#f97316",bg:"#fff7ed"},
            {label:"Miscellaneous",val:totals.misc,color:"#64748b",bg:"#f8fafc"},
          ].map(k => (
            <div key={k.label} className="kpi-card">
              <div style={{fontSize:10,fontWeight:600,color:"#5a7fa8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{k.label}</div>
              <div style={{fontSize:32,fontWeight:700,color:k.color,lineHeight:1}}>{k.val}</div>
              <div style={{height:3,borderRadius:2,background:k.bg,marginTop:10}} />
            </div>
          ))}
        </div>

        {/* CHARTS ROW 1 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
          <div className="chart-card">
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:16}}>Occurrences by Quarter</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{left:-10,right:10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2eeff" />
                <XAxis dataKey="quarter" tick={{fontSize:11,fill:"#5a7fa8"}} />
                <YAxis tick={{fontSize:11,fill:"#5a7fa8"}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize:11}} />
                <Bar dataKey="ANS" stackId="a" fill={ANS_COLOR} radius={[0,0,0,0]} />
                <Bar dataKey="ADR" stackId="a" fill={ADR_COLOR} radius={[0,0,0,0]} />
                <Bar dataKey="Misc" stackId="a" fill="#94a3b8" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:16}}>SPI Frequency Overview</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={spiBarData} layout="vertical" margin={{left:10,right:20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2eeff" horizontal={false} />
                <XAxis type="number" tick={{fontSize:11,fill:"#5a7fa8"}} />
                <YAxis dataKey="name" type="category" tick={{fontSize:10,fill:"#1e3a5f"}} width={140} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[0,4,4,0]}>
                  {spiBarData.map((d,i) => <Cell key={i} fill={d.unit==="ANS"?ANS_COLOR:ADR_COLOR} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHARTS ROW 2 */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
          <div className="chart-card">
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:ANS_COLOR}} />
              <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>ANS SPI Trends</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ansLineData} margin={{left:-10,right:10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2eeff" />
                <XAxis dataKey="quarter" tick={{fontSize:11,fill:"#5a7fa8"}} />
                <YAxis tick={{fontSize:11,fill:"#5a7fa8"}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize:10}} />
                {ANS_SPIS.map((k,i) => <Line key={k} type="monotone" dataKey={k} name={SPI_LABELS[k]} stroke={ANS_SPI_COLORS[i]} strokeWidth={2} dot={{r:3}} />)}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:ADR_COLOR}} />
              <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>ADR SPI Trends</div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={adrLineData} margin={{left:-10,right:10}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2eeff" />
                <XAxis dataKey="quarter" tick={{fontSize:11,fill:"#5a7fa8"}} />
                <YAxis tick={{fontSize:11,fill:"#5a7fa8"}} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{fontSize:10}} />
                {ADR_SPIS.map((k,i) => <Line key={k} type="monotone" dataKey={k} name={SPI_LABELS[k]} stroke={ADR_SPI_COLORS[i]} strokeWidth={2} dot={{r:3}} />)}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SPI TABLES */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
          {[{unit:"ANS",spis:ANS_SPIS,color:ANS_COLOR,bg:"#e0f2fe"},{unit:"ADR",spis:ADR_SPIS,color:ADR_COLOR,bg:"#fff7ed"}].map(({unit,spis,color,bg}) => (
            <div key={unit} className="chart-card">
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
                <div style={{background:color,color:"#fff",borderRadius:6,padding:"3px 10px",fontSize:12,fontWeight:700}}>{unit}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f"}}>SPI Breakdown</div>
              </div>
              {spis.map((k,i) => {
                const cnt = activeQuarters.reduce((s,q) => s+(data.summary[q]?.[k]||0),0);
                const recs = filteredRecords.filter(r => r.spis[k]===1);
                return (
                  <div key={k} className="spi-row" onClick={() => setModal({spi:k,label:SPI_LABELS[k],records:recs,color})}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,fontWeight:600,color:"#1e3a5f"}}>{SPI_LABELS[k]}</div>
                      <div style={{fontSize:10,color:"#5a7fa8",marginTop:1}}>{k}</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:80,height:6,background:"#e2eeff",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${Math.min(100,(cnt/10)*100)}%`,background:color,borderRadius:3}} />
                      </div>
                      <div style={{fontSize:16,fontWeight:700,color,minWidth:24,textAlign:"right"}}>{cnt}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* OCCURRENCE TABLE */}
        <div className="chart-card">
          <div style={{fontSize:13,fontWeight:700,color:"#1e3a5f",marginBottom:14}}>Occurrence Records ({filteredRecords.length})</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"2px solid #e2eeff"}}>
                  {["Quarter","Dept","SPI Code","Headline","Report No"].map(h => (
                    <th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:10,fontWeight:700,color:"#5a7fa8",textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((r,i) => (
                  <tr key={i} style={{borderBottom:"1px solid #f0f6ff",transition:"background 0.1s",cursor:"default"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8faff"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"9px 12px",color:"#5a7fa8",fontFamily:"'DM Mono',monospace",fontSize:11}}>{r.quarter}</td>
                    <td style={{padding:"9px 12px"}}>
                      <span style={{background:r.department==="ANS"?"#e0f2fe":"#fff7ed",color:r.department==="ANS"?"#0369a1":"#c2410c",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600}}>{r.department||"—"}</span>
                    </td>
                    <td style={{padding:"9px 12px"}}>
                      <span style={{background:"#f0f6ff",color:"#1e3a5f",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{r.spi_code||"MISC"}</span>
                    </td>
                    <td style={{padding:"9px 12px",color:"#1e3a5f",fontWeight:500}}>{r.headline}</td>
                    <td style={{padding:"9px 12px",color:"#94a3b8",fontSize:10,fontFamily:"'DM Mono',monospace"}}>{r.report_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{marginTop:20,padding:"12px 0",borderTop:"1px solid #c7deff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:10,color:"#94a3b8"}}>Source: ECCAIRS2 · Weston Airport Safety Database</div>
          <div style={{fontSize:10,color:"#94a3b8"}}>Data: 2025</div>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:"#1e3a5f"}}>{modal.label}</div>
                <div style={{fontSize:11,color:"#5a7fa8",marginTop:2}}>{modal.records.length} occurrence{modal.records.length!==1?"s":""}</div>
              </div>
              <button onClick={() => setModal(null)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#94a3b8",lineHeight:1}}>×</button>
            </div>
            <div>
              {modal.records.length === 0 ? (
                <div style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"20px 0"}}>No records in selected filter</div>
              ) : modal.records.map((r,i) => (
                <div key={i} style={{borderLeft:`3px solid ${modal.color}`,paddingLeft:12,marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#1e3a5f"}}>{r.headline}</div>
                  <div style={{fontSize:11,color:"#5a7fa8",marginTop:2}}>{r.quarter} · {r.department} · {r.report_number}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
