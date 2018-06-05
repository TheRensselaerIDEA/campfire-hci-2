mlauncher:
	./launcher/install.sh

mdemo_target:
	./demo_target/install.sh
	

# Clean all repositories and delete installed dependencies
clean:
	# Clean campfire-hci-2/
	rm -R -f campfire-hci-2/node_modules
	rm -f campfire-hci-2/.npmrc
	# Clean demo_target/
	rm -R -f demo_target/node_modules
	rm -R -f demo_target/build
	rm -f demo_target/package-lock.json
	# Clean launcher/
	rm -R -f launcher/node_modules
	rm -f launcher/package-lock.json
