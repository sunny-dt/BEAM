describe("ANALYTICS TESTING", function(){

	it('VERIFIES LOGIN FUNTIONALITY', function(){

		cy.login()
	})
	
	it("ANALYTICS PAGE URL VERIFICATION ", function(){
		
		cy.contains("Analytics").click()
		cy.wait(2000)
		cy.url()
		.should("include", "/analytics")
	})
	
	it("ANALYTICS HOMEPAGE TEST", function(){
		
		//toggle switches test
		cy.get('#barToggleButton').click()
		cy.get('#pieToggleButton').click()
		
		cy.get("#legendSearchInput").type("3K")
		
		//customers tab test
		cy.contains("CUSTOMERS").click()
		
		cy.wait(2000)
		cy.get('#barToggleButton').click()
		cy.get('#pieToggleButton').click()
		
		cy.get("#legendSearchInput").type("Sk Hynix Inc.")
		cy.get('button').contains('Chambers').click()
		// cy.get(':nth-child(1) > a').click()
		// cy.get(':nth-child(2) > a').click()
		// cy.get(':nth-child(3) > a').click()
		cy.get('button').contains('DONE').click()
		cy.wait(2000)
		
		cy.get('button').contains('Customers').click()
		// cy.get(':nth-child(1) > a').click()
		// cy.get(':nth-child(2) > a').click()
		// cy.get(':nth-child(3) > a').click()
		cy.get('button').contains('DONE').click()
	})
	
	it("DRILLING DOWN TO CUSTOMERS => FABS", function(){
		
		cy.contains("SK HYNIX INC.").click()
		
		cy.wait(2000)
		cy.get('#barToggleButton').click()
		cy.get('#pieToggleButton').click()
		
		cy.get('button').contains('Fabs').click()
		cy.get(':nth-child(1) > a').click()
		cy.get(':nth-child(2) > a').click()
		cy.get(':nth-child(3) > a').click()
		cy.get('button').contains('DONE').click()
		
		cy.get("#legendSearchInput").type("M14 PH.1")
		cy.contains("M14 PH.1").click()
		
		cy.wait(2000)
	})
	
	it("DRILLING DOWN TO CUSTOMERS => FABS => CHAMBERS", function(){
		
		cy.get('#barToggleButton').click()
		cy.get('#pieToggleButton').click()
		
		cy.get('button').contains('Chambers').click()
		cy.get(':nth-child(1) > a').click()
		cy.get(':nth-child(2) > a').click()// use the test ids instead of nth child
		cy.get(':nth-child(3) > a').click()
		cy.get('button').contains('DONE').click()
		
		cy.get("#legendSearchInput").type("DUAL MODE DEGAS")
		cy.contains("DUAL MODE DEGAS").click()
		cy.wait(2000)
		cy.contains("OK").click()
		
	})
	
	it("REDIRECTING TO BEAM PORTAL", function(){
		cy.get("#homePageBack").click()
		cy.wait(2000)
		cy.get("#homePageBack").click()
		cy.get("#amatLogo").click()
		//cy.wait(8000)
		//cy.contains("Analytics").click()
		
	})
	it("TESTING CHAMBERS PAGE & DRILLING DOWN TO CHAMBERS => CUSTOMERS",function(){
	
		
		
		cy.wait(5000)
		cy.get('button').contains('Customers').click()
		
		
		
		// cy.get(':nth-child(1) > a').click()
		// cy.get(':nth-child(2) > a').click()
		// cy.get(':nth-child(3) > a').click()
		cy.get('button').contains('CANCEL').click()
		cy.contains("SIP TTN").click()
	})
	
	it("DRILLING DOWN TO CHAMBERS => CUSTOMERS => FABS", function(){
		cy.get('#barToggleButton').click()
		cy.get('#pieToggleButton').click()
		
		cy.get('button').contains('Customers').click()
		cy.get(':nth-child(1) > a').click()
		cy.get(':nth-child(2) > a').click()
		cy.get(':nth-child(3) > a').click()
		cy.get('button').contains('DONE').click()
		
		cy.get("#legendSearchInput").type("SAMSUNG AMERICA, INC.")
		cy.contains("SAMSUNG AMERICA, INC.").click()
	})

	it("TESTING FAB PAGE AND LOGOUT", function(){
		cy.get('#barToggleButton').click()
		cy.get('#pieToggleButton').click()
		
		cy.get('button').contains('Fabs').click()
		cy.get(':nth-child(1) > a').click()
		cy.get(':nth-child(2) > a').click()
		cy.get(':nth-child(3) > a').click()
		cy.get('button').contains('DONE').click()	


		
	})

})