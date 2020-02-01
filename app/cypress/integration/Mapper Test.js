describe("MAPPER TEST", function() {
	it("VERIFIES LOGIN FUNTIONALITY AND URL", function() {
		
		cy.login()
		
		
		
	})
	
	// it("VERIFYING MAPPER", function() {
		
	// 	cy.contains("Mapper").click()
		
	// 	cy.url()
    //     .should("include", "/g3mapper")
    // })

    // it("SELECTING PLATFORM AND ENTERING THE CONFIGURATION", function() {
    //     cy.get("#selectPlatformID").click()
    //     cy.contains("Endura2").click()
    //     cy.get("button").contains("SUBMIT").click()
    //     cy.get("#chambers0").click()
    //     cy.contains("CONTINUE").click()
    //     cy.get("#knownChambers0").click()
    //     cy.get("#incrementQtyButton").click()
    //     cy.contains("CONTINUE").click()
    //     cy.get("button").contains("SUBMIT").click()
    //     cy.contains("OK").click()
    //     cy.contains("BACK").click()
    //     cy.get("#clearButton").click()
    //     cy.get("#chambers0").click()
    //     cy.contains("CONTINUE").click()
    //     cy.wait(2000)
    //     cy.get("#knownChambers1").click()
    //     cy.get("#incrementQtyButton").dblclick()
    //     cy.contains("CONTINUE").click()
    // })
})