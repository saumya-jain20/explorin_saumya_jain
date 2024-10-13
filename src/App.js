import React, { useState } from 'react';
import {
  Checkbox,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Box,
  Grid,
  Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import './App.css';

function WorkOrder() {
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedActivities, setExpandedActivities] = useState({});
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [selectedWorkItems, setSelectedWorkItems] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const packages = [
    { id: 1, name: 'Civil 1', rate: 567.80, total: '₹ 2,98,6792' },
    { id: 2, name: 'Civil 2', rate: 567.80, total: '₹ 2,98,6792' },
    { id: 3, name: 'Civil 3', rate: 567.80, total: '₹ 2,98,6792' },
    { id: 4, name: 'Civil 4', rate: 567.80, total: '₹ 2,98,6792' },
    { id: 5, name: 'Civil 5', rate: 567.80, total: '₹ 2,98,6792' },
  ];

  const handleExpandClick = (packageId) => {
    setExpandedRows((prev) => ({ ...prev, [packageId]: !prev[packageId] }));
  };

  const handleActivityExpandClick = (packageId, activityIndex) => {
    const key = `${packageId}-${activityIndex}`;
    setExpandedActivities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePackageChange = (event, packageId) => {
    const updatedPackages = [...selectedPackages];
    if (event.target.checked) {
      updatedPackages.push(packageId);
      const allWorkItemKeys = Array.from({ length: 4 }, (_, activityIndex) => {
        return Array.from({ length: 4 }, (_, workItemIndex) => `${packageId}-${activityIndex}-${workItemIndex}`);
      }).flat();
      setSelectedWorkItems((prev) => [...new Set([...prev, ...allWorkItemKeys])]);
    } else {
      const index = updatedPackages.indexOf(packageId);
      if (index > -1) updatedPackages.splice(index, 1);
      const allWorkItemKeys = Array.from({ length: 4 }, (_, activityIndex) => {
        return Array.from({ length: 4 }, (_, workItemIndex) => `${packageId}-${activityIndex}-${workItemIndex}`);
      }).flat();
      setSelectedWorkItems((prev) => prev.filter(item => !allWorkItemKeys.includes(item)));
    }
    setSelectedPackages(updatedPackages);
  };

  const handleWorkItemChange = (event, packageId, activityIndex, workItemIndex) => {
    const updatedWorkItems = [...selectedWorkItems];
    const workItemKey = `${packageId}-${activityIndex}-${workItemIndex}`;
    if (event.target.checked) {
      updatedWorkItems.push(workItemKey);
    } else {
      updatedWorkItems.splice(updatedWorkItems.indexOf(workItemKey), 1);
    }
    setSelectedWorkItems(updatedWorkItems);
  };

  const handleActivitySelectAll = (event, packageId, activityIndex) => {
    const updatedWorkItems = [...selectedWorkItems];
    if (event.target.checked) {
      for (let j = 0; j < 4; j++) {
        const workItemKey = `${packageId}-${activityIndex}-${j}`;
        if (!updatedWorkItems.includes(workItemKey)) {
          updatedWorkItems.push(workItemKey);
        }
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const workItemKey = `${packageId}-${activityIndex}-${j}`;
        updatedWorkItems.splice(updatedWorkItems.indexOf(workItemKey), 1);
      }
    }
    setSelectedWorkItems(updatedWorkItems);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'other') {
      setMessage('Hello World!');
    } else {
      setMessage('');
    }
  };

  const handleSave = () => {
    const selectedData = selectedPackages.map(pkg => {
      const workItems = Array.from({ length: 4 }, (_, activityIndex) => {
        return Array.from({ length: 4 }, (_, workItemIndex) => `${pkg}-${activityIndex}-${workItemIndex}`);
      }).flat().filter(item => selectedWorkItems.includes(item));
      return { packageId: pkg, workItems };
    });
    console.log('Selected Data:', selectedData);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Create Workorder
          </Typography>
        </Grid>

        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#20b2aa', color: '#fff' }}
            onClick={handleSave}
          >
            Save
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <Typography
            variant="h6"
            sx={{
              display: 'inline',
              cursor: 'pointer',
              textDecoration: activeTab === 'overview' ? 'underline' : 'none',
              marginRight: 2,
            }}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </Typography>
          <Typography
            variant="h6"
            sx={{
              display: 'inline',
              cursor: 'pointer',
              textDecoration: activeTab === 'other' ? 'underline' : 'none',
            }}
            onClick={() => handleTabChange('other')}
          >
            Other
          </Typography>
        </Grid>

        {activeTab === 'other' ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Hello World!
            </Typography>
          </Grid>
        ) : (
          <>
            <Grid item xs={12}>
              <TableContainer sx={{ backgroundColor: 'transparent', borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell sx={{ width: '50%' }}>Packages</TableCell>
                      <TableCell sx={{ width: '25%' }}>Rate (in sqft)</TableCell>
                      <TableCell sx={{ width: '25%' }}>Total</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {packages.map((pkg) => (
                      <React.Fragment key={pkg.id}>
                        <TableRow>
                          <TableCell>
                            <Checkbox
                              checked={selectedPackages.includes(pkg.id)}
                              onChange={(event) => handlePackageChange(event, pkg.id)}
                            />
                          </TableCell>
                          <TableCell>{pkg.name}</TableCell>
                          <TableCell>{pkg.rate}</TableCell>
                          <TableCell>{pkg.total}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleExpandClick(pkg.id)} size="small" sx={{ color: '#20b2aa' }}>
                              {expandedRows[pkg.id] ? <RemoveIcon /> : <AddIcon />}
                            </IconButton>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                            <Collapse in={expandedRows[pkg.id]} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2 }}>
                                <div className="tree-node">
                                  {Array.from({ length: 4 }, (_, i) => (
                                    <Box key={i} sx={{ marginBottom: 2 }}>
                                      <Grid container alignItems="center">
                                        <Grid item xs={1}>
                                          <Checkbox
                                            checked={selectedWorkItems.some(item => item.startsWith(`${pkg.id}-${i}-`))}
                                            onChange={(event) => handleActivitySelectAll(event, pkg.id, i)}
                                          />
                                        </Grid>
                                        <Grid item xs={11} sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Typography variant="body1" sx={{ marginRight: 2 }}>
                                            Activity {i + 1}
                                          </Typography>
                                          <IconButton onClick={() => handleActivityExpandClick(pkg.id, i)} size="small">
                                            {expandedActivities[`${pkg.id}-${i}`] ? <RemoveIcon /> : <AddIcon />}
                                          </IconButton>
                                        </Grid>
                                      </Grid>
                                      <Collapse in={expandedActivities[`${pkg.id}-${i}`]} timeout="auto" unmountOnExit>
                                        <Box sx={{ marginLeft: 2 }}>
                                          {Array.from({ length: 4 }, (_, j) => (
                                            <Grid container key={j} alignItems="center">
                                              <Grid item xs={1}>
                                                <Checkbox
                                                  checked={selectedWorkItems.includes(`${pkg.id}-${i}-${j}`)}
                                                  onChange={(event) => handleWorkItemChange(event, pkg.id, i, j)}
                                                />
                                              </Grid>
                                              <Grid item xs={11}>
                                                <Typography variant="body2">Work Item {j + 1}</Typography>
                                              </Grid>
                                            </Grid>
                                          ))}
                                        </Box>
                                      </Collapse>
                                    </Box>
                                  ))}
                                </div>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </>
        )}
      </Grid>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Workorder saved successfully!"
        action={
          <Button color="inherit" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </Box>
  );
}

export default WorkOrder;
