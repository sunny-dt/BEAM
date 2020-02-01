describe("EXPLORER TESTING",function(){
    
    it("VERIFIES LOGIN FUNTIONALITY AND REDIRECTS TO EXPLORER", function(){
        cy.login()
        
        cy.get('.explorer-text').click()
        
        cy.wait(2000)
        
        cy.url()
		.should("include", "/explorer")
    })
    
    
    it("ENDURA2 CHAMBER DETAILS TESTING", function(){
        cy.contains("ENDURA2").click()
        cy.wait(2000)

        cy.url()
        .should("include", "/explorer/Endura2/")
//----------------------------------------------------------------------------------------//
        //INTEGRATED MENU
        cy.contains("Integrated Systems").click()
       
        //Cubs Submenu
        cy.contains("Cubs").click()
        cy.contains("Cubs PVD").click()
        cy.contains("Cubs CVD Liner").click()
        cy.contains("Cubs ALD Barrier CVD Liner").click()
        cy.contains("Cubs Reflow").click()
        cy.contains("Cubs").click()
       
        //ILB submenu
        cy.contains("ILB").click()
        cy.contains("ILB Silicide").click()
        cy.contains("Conformal ALD Silicide").click()
        cy.contains("ILB").click()
        
        //COBALT FILL submenu

        cy.contains("Cobalt Fill").click()
        cy.contains("Co Fill Integrated").click()
        cy.contains("Co Fill CVD").click()
        cy.contains("Co Fill PVD").click()
        cy.contains("Cobalt Fill").click()

        //Metal Gate First submenu
        cy.contains("Metal Gate First").click()
        cy.contains("Avenir Gate First").click()
        cy.contains("Gate Last Al Fill").click()
        cy.contains("Avenir Gate Last High K Cap").click()
        cy.contains("Avenir Gate Last N Metal").click()
        cy.contains("Metal Gate First").click()

        //Silicides submenu
        cy.contains("Silicides").click()
        cy.contains("NI+CO Silicide").click()
        cy.contains("PVD W").click()
        cy.contains("PVD W SiN Bitline Stack").click()
        cy.contains("Silicides").click()

        //TTN submenu
        cy.contains("TTN").click()
        cy.contains("CuW PVD Only").click()
        cy.contains("CuW ILB").click()
        cy.contains("PVD TTN LB").click()
        cy.contains("TTN").click()

        //Capping submenu
        cy.contains("Capping").click()
        cy.contains("Co Capping").click()
        cy.contains("Capping").click()

        //Selective Fill submenu
        cy.contains("Selective Fill").click()


        //given ->login
        //when -> conditions
        //then -> assert 



        cy.contains("Integrated Selective W").click()
        cy.contains("Selective Fill").click()
        cy.contains("Integrated Systems").click()
//-----------------------------------------------------------------------------------//

        //PROCESS CHAMBERS MENU
        cy.contains("Process Chambers").click()

        //Degas submenu
        cy.contains("Degas").click()
        cy.contains("Degas C/D").click()
        cy.contains("Dual Mode Degas").click()
        cy.contains("H2/O2 Degas w/o Lamps").click()
        cy.contains("H2/O2 Degas with Lamps").click()
        cy.contains("H2/O2 Degas with Lamps and Cu Baking").click()

        //Preclean submenu
        cy.contains("Preclean").click()
        cy.contains("Siconi Preclean").click()
        cy.contains("E2 Volaris").click()
        cy.contains("Preclean XT Turbo").click()
        
        cy.contains("Metal Clean XT").click()
        cy.contains("Metal Clean XT EF").click()
        cy.contains("Aktiv Preclean").click()
        cy.contains("Aktiv Preclean EF").click()
        cy.contains("Tersa Preclean").click()
        cy.contains("Anneal").click()
        cy.contains("Preclean").click()

        // CVD/ALD subemnu
        cy.contains("CVD/ALD").click()
        cy.contains("Enhanced CVD TxZ").click()
        cy.contains("Volta CVD").click()
        cy.contains("Volta Co Fill").click()
        cy.contains("Volta CVD Co").click()
        cy.contains("Volta CVD W").click()
        cy.contains("Volta Selective W").click()
        cy.contains("Volta XT Co").click()
        cy.contains("ALD2 TaN").click()
        cy.contains("ALD2 TaN Rev. 2.0").click()
        cy.contains("Centilnel ALD TiN").click()
        cy.contains("CVD/ALD").click()

        //PVD submenu
        cy.contains("PVD").click()
        cy.wait(1000)
        cy.contains("Versa PVD").click()
        cy.contains("Versa XLR2 W").click()
        cy.contains("Versa XT Co").click()
        cy.contains("Versa PVD").click()

        cy.contains("Impulse").click()
        cy.contains("Impulse ALN").click()
        cy.contains("Impulse ALoX").click()
        cy.contains("Impulse GST").click()
        cy.contains("Impulse SIN").click()
        cy.contains("Impulse TaOx").click()
        cy.contains("Impulse").click()

        cy.contains("Encore PVD").click()
        cy.contains("SIP ENCORE II Cu").click()
        cy.contains("SIP ENCORE II RF Cu").click()
        cy.contains("SIP ENCORE II RFX Cu w/coil").click()
        cy.contains("SIP ENCORE II RFX Cu w/o coil").click()
        cy.contains("SIP ENCORE II RFXT Cu w/coil").click()
        cy.contains("SIP ENCORE II RFXT Cu w/o coil").click()
        cy.contains("SIP ENCORE II RFXTP Cu w/coil").click()
        cy.contains("SIP ENCORE II RFXTP Cu w/o coil").click()
        cy.contains("AMBER").click()
        cy.contains("SIP ENCORE II Ta(N)").click()
        cy.contains("SIP ENCORE II Ta(N) Rev. 2.0").click()
        cy.contains("SIP ENCORE 3 Ta(N)").click()
        cy.contains("Encore PVD").click()

        cy.contains("Avenir RF DC PVD").click()
        cy.contains("Avenir RF DC AL").click()
        cy.contains("Avenir RF DC HP TIN").click()
        cy.contains("Avenir RF DC LA").click()
        cy.contains("Avenir RF DC LP TIN").click()
        cy.contains("Avenir RF DC NIPT").click()
        cy.contains("Avenir RF DC Si").click()
        cy.contains("Avenir RF DC Ti").click()
        cy.contains("Avenir RF DC TiAl").click()
        cy.contains("Avenir RF DC PVD").click()

        cy.contains("Cirrus PVD").click()
        cy.contains("Cirrus HT CO").click()
        cy.contains("Cirrus HT Reflow").click()
        cy.contains("Cirrus HTX TiN").click()
        cy.contains("Cirrus RT CO").click()
        cy.contains("Cirrus Ti").click()
        cy.contains("Cirrus PVD").click()

        cy.contains("Access PVD").click()
        cy.contains("Access Cu").click()
        cy.contains("Access2 Cu").click()
        cy.contains("Access3 Cu").click()
        cy.contains("Access PVD").click()

        cy.contains("ALPS PVD").click()
        cy.contains("ALPS Aluminum").click()
        cy.contains("ALPS Cobalt").click()
        cy.contains(" ALPS ESI").click()
        cy.contains("ALPS Nickel").click()
        cy.contains("HAR Cobalt PVD").click()
        cy.contains("ALPS PVD").click()

        cy.contains("TTN PVD").click()
        cy.contains("ESIP").click()
        cy.contains("Extensa TTN").click()
        cy.contains("SIP TTN").click()
        cy.contains("Vectra IMP Titanium").click()
        cy.contains("TTN PVD").click()

        cy.contains("Clover PVD").click()
        cy.contains("Clover PVD Cryo-Turbo").click()
        cy.contains("Clover PVD Cryo").click()
        cy.contains("Clover PVD MGO").click()
        cy.contains("Clover PVD").click()

        cy.contains("Standard PVD").click()
        cy.contains("PVD Standard Cu").click()
        cy.contains("PVD Standard Ta(N)").click()
        cy.contains("PVD Clean W").click()
        cy.contains("Standard PVD").click()
        cy.contains("Process Chambers").click()
        
//--------------------------------------------------------------------------------------------//
        //COMMON MODULES MENU
     
        cy.contains("Common Modules").click()
        
        //EFEM submenu
        cy.contains("EFEM").click()
        cy.contains("EFEM Comparo").click()
        //MF Submenu
        cy.contains("MF").click()
        cy.contains("SWLL").click()
        cy.contains("Particle Mgmt. Package").click()
        cy.contains("Robots").click()
        cy.contains("Cryo").click()
        cy.contains("Umbilicals").click()
        cy.contains("Common Modules").click()
//--------------------------------------------------------------------------------------------------//

        //REMOTES MENU

        cy.contains("Remotes").click()
        cy.contains("REMOTE TYPE").click()
        cy.contains("PDM").click()
        cy.contains("Modular").click()
        cy.contains("LINE VOLTAGE").click()
        cy.contains("480V").click()
        cy.contains("440V").click()
        cy.contains("400V").click()
        cy.contains("UPS").click()
        cy.contains("Remotes").click()

//-------------------------------------------------------------------------------------------------//

        //CUSTOM OPTIONS MENU
        cy.contains("Custom Options").click()
        cy.contains("H2/O2 Degas With Lamps & Cu Baking").click()
        cy.contains("Anneal").click()
        cy.contains("Custom Options").click()

//------------------------------------------------------------------------------------------------------//

        //FIRST IN FAB MENU
        cy.contains("First In Fab").click()
        cy.contains("FIF Kit Options").click()
        cy.contains("Generic FIF Kits").click()
        cy.contains(" Chamber FIF Kits").click()
        cy.contains("Maintenance Lift Kits").click()
        cy.contains("First In Fab").click()


    })
    
    
    it("OTHER CHAMBERS TESTING",function(){
        cy.contains("ENDURA2").click()
        cy.contains("ENDURA2 UHV").click()

        cy.url()
        .should("include", "/explorer/Endura2%20UHV/")

        cy.contains("ENDURA2 UHV").click()
        cy.contains("CENTURA ACP").click()

        cy.url()
        .should("include", "/explorer/Centura%20ACP/")

        cy.contains("CENTURA ACP").click()
        cy.contains("PRODUCER METAL").click()

        cy.url()
        .should("include", "/explorer/Producer%20Metal/")
    })

    it("SOFTWARE TESTING",function(){
        cy.get('.mat-button-wrapper > .mat-icon').click()

        cy.contains("Software").click()
        cy.contains("Productivity").click()
        cy.url()
        .should("include", "/explorer/Productivity/")
        cy.contains("A-B Cool").click()
        cy.contains("Priority Burn In").click()
        cy.contains("Advanced PM").click()
        cy.contains("Arc Detect").click()

        cy.contains("PRODUCTIVITY").click()
        cy.contains("COST OF OWNERSHIP").click()
        cy.url()
        .should("include", "/explorer/Cost%20of%20Ownership/")
        cy.contains("Bulk Refill").click()
        cy.contains("PLC Valve Monitoring").click()

        cy.contains("COST OF OWNERSHIP").click()
        cy.contains("YIELD").click()
        cy.url()
        .should("include", "/explorer/Yield/")
        cy.contains("PWS Preconditioning").click()
        cy.contains("PWS Revisit").click()
        cy.contains("PWS Block").click()
        cy.contains("PWS Parallel").click()
        cy.contains("Prevent Blade Overlap").click()
        cy.contains("RDG").click()
        cy.contains("Recipe Offset Table").click()
        cy.contains("Same Cluster/Multi Cluster Revisit").click()
        cy.contains("Multi Cluster Group Transfer Time Stabalization").click()
        
    })

    it("YIELD ENHANCEMENT TESTING",function(){
        cy.get('.mat-button-wrapper > .mat-icon').click()

        cy.contains("Yield Enhancement").click()
        cy.contains("Particle Management").click()
        cy.url()
        .should("include", "/explorer/Particle%20Management/")
        cy.contains("Opera").click()
        cy.contains("Chorus").click()
        cy.contains("SoftTouch").click()

        cy.contains("PARTICLE MANAGEMENT").click()
        cy.contains("BLIZZARD").click()
        cy.url()
        .should("include", "/explorer/Blizzard/")


    })
    
    it("TESTING THE COMPARE FUNCTIONALITY",function(){
        cy.get('.mat-button-wrapper > .mat-icon').click()

        cy.contains("Platforms").click()
        cy.contains("Endura2").click()
        cy.url()
        .should("include", "/app/explorer/Endura2/")
        cy.wait(2000)

        cy.contains("Process Chambers").click()
        cy.contains("Preclean").click()
        cy.contains("Anneal").click()
        cy.get('.compare_button').click()
        cy.contains("Preclean").click()

        
        cy.contains("Degas").click()
        cy.contains("H2/O2 Degas w/o Lamps").click()
        cy.get('.compare_button').click()
        cy.contains("Degas").click()

        cy.contains("CVD/ALD").click()
        cy.contains("ALD2 TaN").click()
        cy.contains("ALD2 TaN Rev. 2.0").click()
        cy.get('.compare_button').click()
        

        cy.get('.footerUpArrowBlock > span > img').click()
        cy.get('.excelDownloadButton').click()
    })
})