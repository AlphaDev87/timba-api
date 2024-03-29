export BASE_URL=https://wso2.alquimiapay.com/apialquimiapay/

get_alq_token() {  
	ALQ_TOKEN=$(curl -k -X POST https://vitae.alquimiadigital.mx/cpanel/index.php/api/oauth2/token  -d "grant_type=password&client_id=testclient&client_secret=testpass&username=alpha.contact.369@proton.me&password=BpiYQp3qg%" | jq .access_token); 
	export ALQ_TOKEN=${ALQ_TOKEN//'"'}; 
}

get_api_token () {  
	API_TOKEN=$(curl -k -X POST https://wso2.alquimiapay.com/token -d "grant_type=client_credentials" -H   "Authorization: Basic V3pONHFMc053Z1dScmN5cDJLVnRXUUtmb21ZYTo1bGlMb0FqMWx1ZG5mcVBRcGpqNXZiNjRMZDRh" | jq '.access_token'); 
	export API_TOKEN=${API_TOKEN//'"'}; 
}

movimientos() { 
	get_api_token; 
	curl -H "Authorization: Bearer $API_TOKEN" \
		-H "AuthorizationAlquimia: Bearer $ALQ_TOKEN" \
		-H 'Content-Type: x-www-form-urlencoded' \
		-X GET \
		"${BASE_URL}1.0.0/v2/cuenta-ahorro-cliente/120902/transaccion" 
}
